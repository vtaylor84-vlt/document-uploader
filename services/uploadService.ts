import { QueuedSubmission } from '../types';

// Utility to simulate network delay
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// NOTE: This function simulates the Vercel Serverless Function logic (Google Drive/Sheets API integration).
// The actual implementation would use 'axios' or 'fetch' to POST the FormData to the Vercel endpoint.

/**
 * Simulates the backend upload process.
 * * @param submission The submission data from the IndexedDB queue.
 * @returns A promise that resolves on successful upload.
 */
export const uploadSubmission = async (submission: QueuedSubmission): Promise<void> => {
    console.log(`[UPLOAD SERVICE] Attempting upload for submission ID: ${submission.data.submissionId}`);
    
    // Simulate network delay and processing
    await simulateDelay(2500);

    const { data: metadata, files } = submission;
    
    // --- Vercel Serverless Function Logic Simulation ---
    try {
        // 1. Log metadata to Google Sheet
        console.log(`[BACKEND] Logging metadata to Google Sheet:`);
        console.table(metadata);

        // 2. Create subfolder name
        const folderName = `Load ${metadata.loadNumber || 'N/A'} - ${metadata.company}`;
        console.log(`[BACKEND] Creating Google Drive folder: ${folderName}`);

        // 3. Save files
        files.forEach((file, index) => {
            const fileExtension = file.fileName.split('.').pop() || 'dat';
            const fileMeta = metadata.files.find(f => f.id === file.id);
            const fileTypeTag = fileMeta?.type.toUpperCase();
            const fileCategoryTag = fileMeta?.category?.replace(/\s/g, '');

            // Renaming logic simulation
            const newFileName = `${fileTypeTag}_${index + 1}${fileCategoryTag ? '_' + fileCategoryTag : ''}.${fileExtension}`;

            console.log(`[BACKEND] Saving file to Drive: ${newFileName} (${(file.content.size / 1024).toFixed(1)} KB)`);
        });

        // Optional: Simulate a 10% network failure rate for queue testing
        if (Math.random() < 0.1) {
             throw new Error("Simulated Network Timeout/Server Error");
        }

        console.log(`[UPLOAD SERVICE] Upload successful for ${submission.data.submissionId}`);
    } catch (error) {
        console.error(`[UPLOAD SERVICE] Upload failed for ${submission.data.submissionId}:`, error);
        // This rejection is critical: it tells the Queue Service to keep the item.
        throw new Error("Upload failed on server simulation."); 
    }
};