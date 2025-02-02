import { Configuration, OpenAIApi } from 'openai';
import { SageMakerRuntimeClient, InvokeEndpointCommand } from '@aws-sdk/client-sagemaker-runtime';
import axios from 'axios'; // For Google Gemini or other REST APIs

const aiProvider = process.env.AI_PROVIDER || 'openai';

// ---------------- OpenAI Integration ----------------
const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    })
);

const generateCategoryWithOpenAI = async (occupation, roleDescription, companyDescription) => {
    const prompt = `
    Categorize the following job:
    Occupation: ${occupation}
    Role Description: ${roleDescription}
    Company Description: ${companyDescription}

    Provide a concise category for the job, such as "Software Engineering", "Marketing", or "Healthcare".
    `;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 50,
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('OpenAI Error:', error);
        throw new Error('Failed to generate category using OpenAI');
    }
};

// ---------------- AWS SageMaker Integration ----------------
const sagemakerClient = new SageMakerRuntimeClient({ region: process.env.AWS_REGION });

const generateCategoryWithAWS = async (occupation, roleDescription, companyDescription) => {
    const payload = JSON.stringify({
        occupation,
        roleDescription,
        companyDescription,
    });

    const command = new InvokeEndpointCommand({
        EndpointName: process.env.AWS_SAGEMAKER_ENDPOINT,
        Body: payload,
        ContentType: 'application/json',
    });

    try {
        const response = await sagemakerClient.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.Body));
        return result.category; // Ensure your SageMaker model returns a `category` field
    } catch (error) {
        console.error('AWS SageMaker Error:', error);
        throw new Error('Failed to generate category using AWS SageMaker');
    }
};

// ---------------- Google Gemini Integration ----------------
const generateCategoryWithGoogle = async (occupation, roleDescription, companyDescription) => {
    const payload = {
        occupation,
        roleDescription,
        companyDescription,
    };

    try {
        const response = await axios.post(
            process.env.GOOGLE_GEMINI_API_URL,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GOOGLE_GEMINI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.category; // Ensure your Gemini model returns a `category` field
    } catch (error) {
        console.error('Google Gemini Error:', error);
        throw new Error('Failed to generate category using Google Gemini');
    }
};

// ---------------- AI Service Abstraction ----------------
export const generateCategory = async (occupation, roleDescription, companyDescription) => {
    if (!occupation || !roleDescription || !companyDescription) {
        throw new Error('All inputs (occupation, roleDescription, companyDescription) are required');
    }

    switch (aiProvider.toLowerCase()) {
        case 'openai':
            return await generateCategoryWithOpenAI(occupation, roleDescription, companyDescription);
        case 'aws':
            return await generateCategoryWithAWS(occupation, roleDescription, companyDescription);
        case 'google':
            return await generateCategoryWithGoogle(occupation, roleDescription, companyDescription);
        default:
            throw new Error(`Unsupported AI provider: ${aiProvider}`);
    }
};
