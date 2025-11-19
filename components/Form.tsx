import React, { useState, useMemo, useCallback } from 'react';
import { LoadSubmission, SelectedFile } from '../types.ts';
import { useTheme } from '../hooks/useTheme.ts';
import { useFormValidation } from '../hooks/useFormValidation.ts';
import { useToast } from './Toast.tsx';
import { COMPANY_OPTIONS, STATES_US } from '../constants.ts';
import { saveSubmissionToQueue } from '../services/queueService.ts';

import { InputField } from './InputField.tsx';
import { SelectField } from './SelectField.tsx';
import { FileUploadArea } from './FileUploadArea.tsx';
import { GeminiAISection } from './GeminiAISection.tsx';


// Initial state for the submission form
const initialFormState: LoadSubmission = {
    company: 'default',
    driverName: '',
    loadNumber: '',
    bolNumber: '',
    pickupCity: '',
    pickupState: '',
    deliveryCity: '',
    deliveryState: '',
    description: '',
    files: [], // Stored in the component state, added here for type consistency
    timestamp: 0,
    submissionId: '',
};

export const Form: React.FC = () => {
    const { company, setCompany, currentTheme } = useTheme();
    const showToast = useToast();
    const [status, setStatus] = useState<'idle' | 'submitting'>('idle'); // Added status state
    
    // Form and File State
    const [form, setForm] = useState<Omit<LoadSubmission, 'files' | 'timestamp' | 'submissionId'>>({
        ...initialFormState,
    });
    const [bolFiles, setBolFiles] = useState<SelectedFile[]>([]);
    const [freightFiles, setFreightFiles] = useState<SelectedFile[]>([]);
    
    // Combine files for validation/submission
    const allFiles = useMemo(() => [...bolFiles, ...freightFiles], [bolFiles, freightFiles]);

    // Validation Hook
    const { isValid } = useFormValidation({ ...form, files: allFiles, timestamp: 0, submissionId: '' }, allFiles);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        
        if (id === 'company') {
            setCompany(value as LoadSubmission['company']);
        }

        setForm(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid) {
            showToast("Please complete all required fields and attach at least one file.", 'error');
            return;
        }
        
        setStatus('submitting'); // Set status to submitting
        
        const submissionId = crypto.randomUUID();
        const finalSubmission: LoadSubmission = {
            ...form,
            company: company, // Use theme-managed company state
            files: allFiles,
            timestamp: Date.now(),
            submissionId: submissionId,
        };

        try {
            // Save to IndexedDB Queue
            await saveSubmissionToQueue(finalSubmission);

            // Immediate Success Feedback (Offline-First Mandate)
            showToast(`Load ${form.loadNumber || 'N/A'} saved to queue! Uploading in background.`, 'success');

            // Reset Form (excluding company selection)
            setForm(initialFormState);
            setBolFiles([]);
            setFreightFiles([]);
        } catch (error) {
            console.error("Failed to save to queue:", error);
            showToast("Critical Error: Could not save submission locally.", 'error');
        } finally {
            setStatus('idle');
        }

    }, [form, allFiles, isValid, company, showToast]);
    
    // Determine the theme glow class based on the selected company
    const formGlowClass = currentTheme.name === 'Greenleaf Xpress' ? 'form-glow-green' : 
                         currentTheme.name === 'BST Expedite' ? 'form-glow-sky' : 
                         'form-glow-cyan';

    const isPulsing = isValid && status !== 'submitting';

    return (
        <form 
            onSubmit={handleSubmit} 
            className={`relative form-container space-y-8 p-6 bg-black/60 rounded-xl backdrop-blur-sm ${formGlowClass}`} // ADDED GLOW CLASSES
        >
            
            {/* --- CORE IDENTIFICATION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border-2 border-slate-700 rounded-lg bg-slate-800 shadow-xl">
                <SelectField
                    label="Company (REQUIRED)"
                    id="company"
                    value={company}
                    options={COMPANY_OPTIONS}
                    onChange={handleChange}
                    required
                    style={{ 
                        boxShadow: `0 0 5px var(--color-primary)`, 
                        borderColor: `var(--color-primary)` 
                    }}
                />
                <InputField
                    label="Driver Name (REQUIRED)"
                    id="driverName"
                    value={form.driverName}
                    onChange={handleChange}
                    required
                />
            </div>
            
            {/* --- LOAD IDENTIFICATION --- */}
            <h2 className={`text-2xl font-orbitron text-[--color-primary] pt-4 ${currentTheme.name === 'Greenleaf Xpress' ? 'glowing-text-green' : currentTheme.name === 'BST Expedite' ? 'glowing-text-sky' : 'glowing-text-cyan'}`}>Load Data</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField label="Load #" id="loadNumber" value={form.loadNumber} onChange={handleChange} />
                <InputField label="BOL #" id="bolNumber" value={form.bolNumber} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                <InputField label="Pickup City" id="pickupCity" value={form.pickupCity} onChange={handleChange} />
                <SelectField label="Pickup State" id="pickupState" value={form.pickupState} options={STATES_US} onChange={handleChange} />
                <InputField label="Delivery City" id="deliveryCity" value={form.deliveryCity} onChange={handleChange} />
                <SelectField label="Delivery State" id="deliveryState" value={form.deliveryState} options={STATES_US} onChange={handleChange} />
            </div>
            
            {/* --- DOCUMENT UPLOADS --- */}
            <h2 className={`text-2xl font-orbitron text-[--color-primary] pt-4 ${currentTheme.name === 'Greenleaf Xpress' ? 'glowing-text-green' : currentTheme.name === 'BST Expedite' ? 'glowing-text-sky' : 'glowing-text-cyan'}`}>Documents & Freight</h2>
            <FileUploadArea files={bolFiles} setFiles={setBolFiles} fileType="BOL" />
            <FileUploadArea files={freightFiles} setFiles={setFreightFiles} fileType="FREIGHT" />

            {/* --- AI DESCRIPTION --- */}
            <GeminiAISection
                freightFiles={freightFiles}
                description={form.description}
                setDescription={(desc) => setForm(prev => ({ ...prev, description: desc }))}
            />

            {/* --- SUBMIT BUTTON --- */}
            <button
    type="submit"
    disabled={!isValid || status === 'submitting'}
    className={`...` /* (Classes unchanged) */}
    style={isValid ? { boxShadow: `var(--shadow-glow)` } : {}}
>
    {status === 'submitting' ? 'INITIATING UPLOAD...' : 'Submit Documents for Load: ' + (form.loadNumber || 'Trip--')}
</button>
            
            {/* Debug/Queue Status (Optional: Add a component here to show pending queue items) */}
        </form>
    );
};