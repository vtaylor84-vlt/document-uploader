import React, { useState, useMemo, useCallback } from 'react';
import { LoadSubmission, SelectedFile } from '../types.ts';
import { useTheme } from '../hooks/useTheme.ts';
import { useFormValidation } from '../hooks/useFormValidation.ts';
import { useToast } from './Toast.tsx';
import { COMPANY_OPTIONS, STATES_US } from '../constants.ts';
import { saveSubmissionToQueue } from '../services/queueService.ts';

// FIX: Importing existing file names
import { InputField } from './InputField.tsx'; 
import { SelectField } from './SelectField.tsx'; 
import { FileUploadArea } from './FileUploadArea.tsx'; 
import { SectionHeader } from './SectionHeader.tsx'; 


// Initial state structure remains the same
const initialFormState: Omit<LoadSubmission, 'files' | 'timestamp' | 'submissionId'> = {
    company: 'default',
    driverName: '',
    loadNumber: '',
    bolNumber: '',
    puCity: '',
    puState: '',
    delCity: '',
    delState: '',
    description: '',
    bolDocType: 'Pick Up'
};

export const Form: React.FC = () => {
    const { company, setCompany, currentTheme } = useTheme();
    const showToast = useToast();
    const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
    
    // Form and File State
    const [form, setForm] = useState<Omit<LoadSubmission, 'files' | 'timestamp' | 'submissionId'>>({
        ...initialFormState,
        company: company,
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
        
        setStatus('submitting');
        
        const submissionId = crypto.randomUUID();
        const finalSubmission: LoadSubmission = {
            ...form,
            company: company,
            files: allFiles,
            timestamp: Date.now(),
            submissionId: submissionId,
        };

        try {
            await saveSubmissionToQueue(finalSubmission);

            showToast(`Load ${form.loadNumber || 'N/A'} saved to queue! Uploading in background.`, 'success');

            setForm({...initialState, company: company}); // Reset form, keeping company selection
            setBolFiles([]);
            setFreightFiles([]);
        } catch (error) {
            console.error("Failed to save to queue:", error);
            showToast("Critical Error: Could not save submission locally.", 'error');
        } finally {
            setStatus('idle');
        }

    }, [form, allFiles, isValid, company, showToast]);
    
    // Theme classes for the container glow
    const formGlowClass = currentTheme.name === 'Greenleaf Xpress' ? 'form-glow-green' : 
                         currentTheme.name === 'BST Expedite' ? 'form-glow-sky' : 
                         'form-glow-cyan';

    const isPulsing = isValid && status !== 'submitting';
    const getLoadIdentifier = () => form.loadNumber || form.bolNumber || `Trip--`;


    return (
        // Main Form Container: Glassmorphism and Dynamic Glow
        <form 
            onSubmit={handleSubmit} 
            className={`relative form-container space-y-8 p-6 bg-black/60 rounded-xl backdrop-blur-sm ${formGlowClass}`}
        >
            
            {/* Company & Driver Section (2 columns) */}
            <div className="grid grid-cols-2 gap-4">
                <SelectField
                    label="Company"
                    id="company"
                    value={company}
                    options={COMPANIES}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Driver's Name"
                    id="driverName"
                    value={form.driverName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., John Doe"
                />
            </div>

            {/* Load Identifiers (2 columns) */}
            <div className="space-y-4">
                <SectionHeader title="Load Data" />
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Load #" id="loadNumber" value={form.loadNumber} onChange={handleChange} placeholder="e.g., 123456" />
                    <InputField label="BOL #" id="bolNumber" value={form.bolNumber} onChange={handleChange} placeholder="e.g., 7891011" />
                </div>
            </div>

            {/* Trip Cities/States (4 columns, stacked 2x2) */}
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Pickup City/State" id="puCity" value={form.puCity} onChange={handleChange} placeholder="City" />
                <SelectField label="Pickup State" id="puState" value={form.puState} options={US_STATES} onChange={handleChange} placeholder="State" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Delivery City/State" id="delCity" value={form.delCity} onChange={handleChange} placeholder="City" />
                <SelectField label="Delivery State" id="delState" value={form.delState} options={US_STATES} onChange={handleChange} placeholder="State" />
            </div>

            {/* Documents & Freight Section */}
            <div className="space-y-3 pt-4">
                <SectionHeader title="Documents & Freight" />
            </div>
            
            {/* BOL Photos / PDFs */}
            <div className="space-y-3 pt-4">
                <div className="flex items-center space-x-4">
                     <h3 className={`text-lg font-bold text-white`}>BOL Photos/PDFs</h3>
                     <SelectField
                        id="bolDocType"
                        label="Select Type..." 
                        srOnlyLabel="Select Type"
                        value={form.bolDocType}
                        options={['Pick Up', 'Delivery']}
                        onChange={handleChange}
                    />
                </div>
                
                <FileUploadArea 
                    id="bolFiles" 
                    files={bolFiles} 
                    onFileChange={(e) => handleFileChange(e, 'bol')}
                    onRemoveFile={handleRemoveFile} 
                    onFileReorder={handleFileReorder}
                    accept="image/*,application/pdf"
                />
            </div>

            {/* Freight Photos / Videos */}
            <div className="space-y-3 pt-4">
                <h3 className={`text-lg font-bold text-white`}>Freight Photos/Videos</h3>
                <FileUploadArea 
                    id="freightFiles" 
                    files={freightFiles} 
                    onFileChange={(e) => handleFileChange(e, 'freight')}
                    onRemoveFile={handleRemoveFile} 
                    onFileReorder={handleFileReorder}
                    accept="image/*,video/*"
                />
            </div>
            
            {/* SUBMIT BUTTON (Matches image aesthetic) */}
            <button
                type="submit"
                disabled={!isValid || status === 'submitting'}
                className={`
                    w-full py-4 rounded-xl text-white font-bold text-lg tracking-wider
                    transition-all duration-300 transform 
                    ${isPulsing ? 'animate-pulse-glow' : ''}
                    ${isValid ? 'bg-gradient-to-r from-[--color-primary] to-[--color-secondary] hover:scale-[1.01]' : 'bg-gray-700 opacity-50 cursor-not-allowed'}
                `}
                style={isValid ? { boxShadow: `var(--shadow-glow)` } : {}}
            >
                {status === 'submitting' ? 'INITIATING UPLOAD...' : `SUBMIT DOCUMENTS FOR LOAD: ${getLoadIdentifier()}`}
            </button>
        </form>
    );
};