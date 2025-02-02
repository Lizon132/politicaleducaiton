export const validateEnv = () => {
    const requiredVars = [
        'OPENAI_API_KEY',
        'AWS_REGION',
        'AWS_SAGEMAKER_ENDPOINT',
        'GOOGLE_GEMINI_API_URL',
        'GOOGLE_GEMINI_API_KEY',
    ];

    requiredVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    });
};
