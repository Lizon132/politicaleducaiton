import express from 'express';
import { nanoid } from 'nanoid';
import { profilesDb, usersDb } from '../database.js';
import { analyzeSentiment, generateFollowUp } from '../utils/aiUtils.js';

const router = express.Router();

// Submit user responses
router.post('/profile/submit', async (req, res) => {
    const { userId, responses } = req.body;

    if (!userId || !responses || !Array.isArray(responses)) {
        return res.status(400).json({ error: 'Invalid request format' });
    }

    try {
        for (const { questionId, response } of responses) {
            // Analyze sentiment
            const confidence = await analyzeSentiment(response);

            // Determine if follow-up is needed
            const followUpNeeded = confidence < 50; // Adjust threshold as needed
            let followUpQuestion = null;

            if (followUpNeeded) {
                followUpQuestion = await generateFollowUp(response);
            }

            // Store response
            profilesDb.run(
                `INSERT INTO user_profiles (user_id, question_id, response, confidence_level, follow_up_needed) VALUES (?, ?, ?, ?, ?)`,
                [userId, questionId, response, confidence, followUpNeeded]
            );
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error processing responses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
