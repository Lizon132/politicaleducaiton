import { config } from 'dotenv';
import OpenAI from 'openai';

config(); // Load environment variables

// Validate the API key
if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY in environment variables');
}

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Test function to list available models
const listModels = async () => {
    try {
        const response = await openai.models.list();
        console.log('Available Models:', response.data);
    } catch (error) {
        console.error('Error listing models:', error.response ? error.response.data : error.message);
    }
};

// Test function to call the OpenAI API
const testOpenAI = async () => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Say hello in a friendly way.' }],
        });

        console.log('OpenAI Response:', response.choices[0].message.content.trim());
    } catch (error) {
        console.error('Error testing OpenAI API:', error.response ? error.response.data : error.message);
    }
};

// Run the test
//listModels();
testOpenAI();
