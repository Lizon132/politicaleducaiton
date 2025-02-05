import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Analyze sentiment and return confidence level (0-100)
export async function analyzeSentiment(text) {
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-4-turbo',
            messages: [{ role: 'system', content: `Analyze sentiment from 0 (strongly disagree) to 100 (strongly agree). Response: ${text}` }]
        });

        // Extract confidence score from response
        const confidence = parseInt(response.choices[0].message.content.match(/\d+/)?.[0]) || 50;
        return confidence;
    } catch (error) {
        console.error('Sentiment analysis failed:', error);
        return 50; // Default confidence level if AI fails
    }
}

// Generate a follow-up question if confidence is low
export async function generateFollowUp(text) {
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-4-turbo',
            messages: [{ role: 'system', content: `Generate a follow-up question based on: ${text}` }]
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Follow-up question generation failed:', error);
        return null;
    }
}
