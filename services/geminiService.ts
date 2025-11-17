import { SelectedFile } from '../types';

// Mock the Gemini API call for a copy-paste-ready environment
// The actual implementation would use the @google/genai SDK.

// IMPORTANT: Replace this with your actual API key in a real application.
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 

const generatePrompt = (fileNames: string[]): string => {
    return `You are an expert logistics coordinator. Based on the following images of freight on a truck, provide a concise, professional description for a Bill of Lading. Mention the type of goods, packaging (e.g., pallets, boxes), and any visible special handling notes. Do not describe the truck itself, only the cargo. The files for analysis are: ${fileNames.join(', ')}.`;
};

const fileToGenerativePart = async (file: File) => {
    // Convert file to Base64 (required for Gemini API call)
    const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
    
    return {
        inlineData: {
            data: base64Data,
            mimeType: file.type
        }
    };
};

/**
 * Analyzes freight images using the Gemini 2.5 Flash model.
 * @param files Array of SelectedFile objects for cargo analysis.
 * @returns A promise that resolves to the AI-generated description string.
 */
export const generateDescription = async (files: SelectedFile[]): Promise<string> => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        console.warn("Gemini API Key not set. Returning mock response.");
        await new Promise(r => setTimeout(r, 1500)); // Simulate delay
        return "AI Description: 12 standard-sized pallets containing mixed consumer electronics, shrink-wrapped and stacked 5 high. Visible warning labels for 'Fragile: Handle with Care'. No overt damage observed.";
    }

    const imageParts = await Promise.all(
        files.filter(f => f.file.type.startsWith('image/')).map(f => fileToGenerativePart(f.file))
    );

    const fileNames = files.map(f => f.file.name);
    const prompt = generatePrompt(fileNames);
    
    // The actual API call structure (conceptually):
    /*
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [ {text: prompt}, ...imageParts ] }]
        })
    });
    
    if (!response.ok) throw new Error("Gemini API call failed.");
    const json = await response.json();
    return json.candidates[0].content.parts[0].text;
    */
    
    // Mock return:
    console.log(`[GEMINI SERVICE] Sending ${imageParts.length} images to AI with prompt: ${prompt}`);
    await new Promise(r => setTimeout(r, 2000));
    return "AI Description: 12 standard-sized pallets containing mixed consumer electronics, shrink-wrapped and stacked 5 high. Visible warning labels for 'Fragile: Handle with Care'. No overt damage observed.";
};