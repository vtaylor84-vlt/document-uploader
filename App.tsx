import React from 'react';
import { Header } from './components/Header';
import { FormField } from './components/FormField';
import { SelectField } from './components/SelectField';
import { FileUploadArea } from './components/FileUploadArea';
import { Toast } from './components/Toast';
import { GeminiAISection } from './components/GeminiAISection';
import { useUploader } from './hooks/useUploader';
import { COMPANIES, US_STATES } from './constants';
import { SectionHeader } from './components/SectionHeader';

export default function App() {
  const {
    formState,
    fileState,
    status,
    toast,
    validationError,
    handleInputChange,
    handleFileChange,
    handleRemoveFile,
    handleFileReorder,
    handleSubmit,
    generateDescription,
  } = useUploader();

  const isFormValid =
    formState.company &&
    formState.driverName &&
    (formState.loadNumber || formState.bolNumber || (formState.puCity && formState.delCity)) &&
    (fileState.bolFiles.length > 0 || fileState.freightFiles.length > 0);
  
  const getLoadIdentifier = () => {
    if (!isFormValid) return '';
    return formState.loadNumber || formState.bolNumber || `Trip-${formState.puCity.toUpperCase()}-${formState.delCity.toUpperCase()}`;
  };
  
  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center p-4 selection:bg-cyan-400 selection:text-black relative z-10">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        
        <main className="mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="bg-black/80 glowing-border-cyan p-1 space-y-4"
          >
            {/* Company & Driver Section */}
            <div className="bg-[#111] p-4 space-y-4">
               <SelectField
                id="company"
                label="Company (REQUIRED)"
                value={formState.company}
                onChange={handleInputChange}
                options={COMPANIES.map(c => ({ value: c, label: c === '' ? 'Select an option' : c }))}
                required
              />
              <FormField
                id="driverName"
                label="Driver Name (REQUIRED)"
                value={formState.driverName}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            
            {/* Load Data Section */}
            <div className="bg-[#111] p-4 space-y-4">
                <SectionHeader title="Load Data" />
                <FormField id="loadNumber" label="Load #" value={formState.loadNumber} onChange={handleInputChange} placeholder="e.g., 123456" />
                <FormField id="bolNumber" label="BOL #" value={formState.bolNumber} onChange={handleInputChange} placeholder="e.g., 7891011" />
                <div className="grid grid-cols-2 gap-4">
                    <FormField id="puCity" label="Pickup City" value={formState.puCity} onChange={handleInputChange} placeholder="City" />
                    <SelectField id="puState" label="Pickup State" value={formState.puState} onChange={handleInputChange} options={US_STATES.map(s => ({ value: s, label: s || 'Select an option' }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField id="delCity" label="Delivery City" value={formState.delCity} onChange={handleInputChange} placeholder="City" />
                    <SelectField id="delState" label="Delivery State" value={formState.delState} onChange={handleInputChange} options={US_STATES.map(s => ({ value: s, label: s || 'Select an option' }))} />
                </div>
            </div>

            {/* Documents & Freight Section */}
            <div className="bg-[#111] p-4 space-y-6">
                <SectionHeader title="Documents & Freight" />
                
                {/* BOL/POD Uploads */}
                <div className="p-3 border border-gray-700 bg-black/50">
                    <h3 className="font-orbitron font-bold text-lg mb-3">BOL / POD Uploads</h3>
                    <div className="radio-group flex items-center space-x-6 mb-4">
                        <span className="font-bold text-gray-300">BOL Type:</span>
                        <div>
                            <input type="radio" id="pickup" name="bolDocType" value="Pick Up" checked={formState.bolDocType === 'Pick Up'} onChange={handleInputChange} />
                            <label htmlFor="pickup">Pick Up</label>
                        </div>
                        <div>
                            <input type="radio" id="delivery" name="bolDocType" value="Delivery" checked={formState.bolDocType === 'Delivery'} onChange={handleInputChange} />
                            <label htmlFor="delivery">Delivery</label>
                        </div>
                    </div>
                    <FileUploadArea
                        id="bolFiles"
                        files={fileState.bolFiles}
                        onFileChange={handleFileChange}
                        onRemoveFile={handleRemoveFile}
                        onFileReorder={handleFileReorder}
                        accept="image/*,application/pdf"
                    />
                </div>

                {/* Freight/Video Uploads */}
                <div className="p-3 border border-gray-700 bg-black/50">
                    <h3 className="font-orbitron font-bold text-lg mb-3">Freight / Video Uploads</h3>
                    <FileUploadArea
                        id="freightFiles"
                        files={fileState.freightFiles}
                        onFileChange={handleFileChange}
                        onRemoveFile={handleRemoveFile}
                        onFileReorder={handleFileReorder}
                        accept="image/*,video/*"
                    />
                </div>

                {/* AI Cargo Analysis */}
                {fileState.freightFiles.length > 0 && (
                    <div className="p-3 border border-gray-700 bg-black/50">
                        <GeminiAISection
                            onGenerate={() => generateDescription(fileState.freightFiles)}
                            description={formState.description}
                            handleInputChange={handleInputChange}
                            status={status}
                        />
                    </div>
                )}
            </div>

            <div className="p-2">
              {validationError && <p className="text-red-400 text-center mb-4">{validationError}</p>}
              <button
                type="submit"
                disabled={!isFormValid || status === 'submitting'}
                className={`w-full text-lg font-orbitron font-bold text-black rounded-sm py-3 transition-all duration-300 ease-in-out
                           bg-gray-400 hover:bg-white
                           disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed
                           shadow-lg hover:shadow-cyan-500/50
                           flex items-center justify-center space-x-2`}
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>
                    {isFormValid ? `Submit Documents for Load: ${getLoadIdentifier()}` : 'Complete Required Fields'}
                  </span>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>

      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => {}}
        />
      )}
    </div>
  );
}