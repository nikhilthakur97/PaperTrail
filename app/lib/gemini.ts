import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Use gemini-2.0-flash-exp for latest responses
export const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export default genAI;
