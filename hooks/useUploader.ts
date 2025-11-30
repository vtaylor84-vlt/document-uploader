// hooks/useUploader.ts
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Company, FileData, SubmissionData, Theme, QueuedSubmission, DocType, BOLSubtype } from '../types.ts';
import { THEMES, COMPANIES, US_STATES } from '../constants.ts';
import { addToQueue, processQueue, getQueue } from '../services/queueService.ts';
import { useToasts } from './useToasts.ts';
import { generateCargoDescription } from '../services/geminiService.ts'; // Assuming this is the correct export name

export const useUploader = () => {
  // --- Form State ---
  const [company, setCompany] = useState<Company>('Greenleaf Xpress');
  const [driverName, setDriverName] = useState('');
  const [loadNumber, setLoadNumber] = useState('');
  const [bolNumber, setBolNumber] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState(US_STATES[0] || '');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState(US_STATES[0] || '');
  const [description, setDescription] = useState('');
  const [bolFiles, setBolFiles] = useState<FileData[]>([]);
  const [freightFiles, setFreightFiles] = useState<FileData[]>([]);

  // --- Queue State & Toasts ---
  const [queue, setQueue] = useState<QueuedSubmission[]>(getQueue());
  const { addToast } = useToasts();

  // --- Dynamic Branding ---
  const theme: Theme = useMemo(() => THEMES[company] || THEMES['Default'], [company]);

  // --- Validation Logic ---
  const isSubmittable = useMemo(() => {
    const coreIdsPresent = loadNumber || bolNumber || (pickupCity && pickupState && deliveryCity && deliveryState);
    const filesAttached = bolFiles.length > 0 || freightFiles.length > 0;
    
    // Check if ALL required text/select fields are non-empty
    const fieldsValid = !!company && !!driverName;

    return fieldsValid && coreIdsPresent && filesAttached;
  }, [company, driverName, loadNumber, bolNumber, pickupCity, pickupState, deliveryCity, deliveryState, bolFiles.length, freightFiles.length]);

  // --- Submission Handler ---
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmittable) {
      addToast('error', 'Validation failed. Please fill all required fields and attach at least one file.');
      return;
    }

    // 1. Prepare file list for submission (File objects only)
    const filesForSubmission = [...bolFiles.map(f => f.file), ...freightFiles.map(f => f.file)];

    const submission: SubmissionData = {
      company,
      driverName,
      loadNumber,
      bolNumber,
      pickupCity,
      pickupState,
      deliveryCity,
      deliveryState,
      description,
      files: filesForSubmission,
      timestamp: Date.now(),
    };

    // 2. Save to Offline Queue (IndexedDB Simulation)
    const queueId = addToQueue(submission);

    // 3. Immediate UI Feedback
    addToast('success', `Load ${loadNumber || bolNumber || 'data'} saved instantly! Queue ID: ${queueId}`);

    // 4. Reset Form
    setLoadNumber('');
    setBolNumber('');
    setPickupCity('');
    setPickupState(US_STATES[0] || '');
    setDeliveryCity('');
    setDeliveryState(US_STATES[0] || '');
    setDescription('');
    setBolFiles([]);
    setFreightFiles([]);
    
    // 5. Trigger Queue Processing
    handleProcessQueue();

  }, [isSubmittable, company, driverName, loadNumber, bolNumber, pickupCity, pickupState, deliveryCity, deliveryState, description, bolFiles, freightFiles, addToast]);

  // --- Queue Processing Management ---
  const handleSuccess = useCallback((loadId: string, queueId: string) => {
    addToast('success', `[Upload] Load ${loadId} complete! Processed from queue ${queueId}.`);
  }, [addToast]);

  const handleError = useCallback((queueId: string, error: Error) => {
    addToast('error', `[Upload Failed] ID ${queueId}. Retrying later. Error: ${error.message}`);
  }, [addToast]);
  
  const handleQueueUpdate = useCallback((newQueue: QueuedSubmission[]) => {
      setQueue(newQueue);
  }, [setQueue]);
  
  const handleProcessQueue = useCallback(() => {
      processQueue(handleSuccess, handleError, handleQueueUpdate);
  }, [handleSuccess, handleError, handleQueueUpdate]);

  // Start processing queue on component mount and on internet status change
  useEffect(() => {
      handleProcessQueue(); // Initial attempt to clear queue on load
      
      window.addEventListener('online', handleProcessQueue);
      return () => {
          window.removeEventListener('online', handleProcessQueue);
      };
  }, [handleProcessQueue]);

  // --- Public Handlers ---
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: DocType) => {
        if (!e.target.files) return;

        const filesToProcess = Array.from(e.target.files).map(file => ({
            id: crypto.randomUUID(),
            file,
            type,
            bolSubtype: type === 'BOL' ? 'Delivery' : undefined,
            previewUrl: file.type.startsWith('image/') || file.type.startsWith('video/')
                ? URL.createObjectURL(file)
                : '',
        } as FileData));

        if (type === 'BOL') {
            setBolFiles(prev => [...prev, ...filesToProcess]);
        } else {
            setFreightFiles(prev => [...prev, ...filesToProcess]);
        }
        
        if (e.target) {
            e.target.value = '';
        }
    }, []);

  const handleRemoveFile = useCallback((fileId: string, type: DocType) => {
        const targetSet = type === 'BOL' ? bolFiles : freightFiles;
        const setTargetSet = type === 'BOL' ? setBolFiles : setFreightFiles;

        const fileToRemove = targetSet.find(f => f.id === fileId);
        if (fileToRemove?.previewUrl) {
            URL.revokeObjectURL(fileToRemove.previewUrl);
        }
        setTargetSet(targetSet.filter(f => f.id !== fileId));
    }, [bolFiles, freightFiles]);

    const handleFileReorder = useCallback((draggedId: string, targetId: string, type: DocType) => {
        // (Reorder logic would be implemented here, but is omitted for brevity)
    }, []);


  return {
    // State
    company, setCompany,
    driverName, setDriverName,
    loadNumber, setLoadNumber,
    bolNumber, setBolNumber,
    pickupCity, setPickupCity,
    pickupState, setPickupState,
    deliveryCity, setDeliveryCity,
    deliveryState, setDeliveryState,
    description, setDescription,
    bolFiles, setBolFiles,
    freightFiles, setFreightFiles,
    
    // Data & Logic
    theme,
    isSubmittable,
    handleSubmit,
    queue,
    handleInputChange,
    handleFileChange: handleFileChange as (e: React.ChangeEvent<HTMLInputElement>, type: DocType) => void,
    handleRemoveFile: handleRemoveFile as (fileId: string, type: DocType) => void,
    handleFileReorder: handleFileReorder as (draggedId: string, targetId: string, type: DocType) => void,
  };
};