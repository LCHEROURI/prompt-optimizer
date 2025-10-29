
import React from 'react';
import { FilesState, FileType } from '../types';
import { ImageIcon, DocumentIcon, AudioIcon, XCircleIcon, SparklesIcon } from './IconComponents';

interface FileInputProps {
  id: FileType;
  label: string;
  Icon: React.FC<{ className?: string }>;
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => void;
  onRemoveFile: (type: FileType) => void;
  accept: string;
}

const FileInput: React.FC<FileInputProps> = ({ id, label, Icon, file, onFileChange, onRemoveFile, accept }) => (
  <div className="mt-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
      <Icon className="w-5 h-5" />
      {label}
    </label>
    {file ? (
      <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
        <p className="text-sm text-gray-300 truncate">{file.name}</p>
        <button onClick={() => onRemoveFile(id)} className="text-gray-400 hover:text-white transition-colors">
          <XCircleIcon className="w-5 h-5" />
        </button>
      </div>
    ) : (
      <>
        <input
          id={id}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => onFileChange(e, id)}
        />
        <label
          htmlFor={id}
          className="cursor-pointer flex justify-center items-center w-full px-4 py-2 text-sm text-gray-300 bg-gray-700/50 rounded-md border-2 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all"
        >
          Click to upload
        </label>
      </>
    )}
  </div>
);

interface InputSectionProps {
  userInput: string;
  setUserInput: (value: string) => void;
  files: FilesState;
  setFiles: React.Dispatch<React.SetStateAction<FilesState>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ userInput, setUserInput, files, setFiles, onSubmit, isLoading }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const handleRemoveFile = (type: FileType) => {
    setFiles(prev => ({ ...prev, [type]: null }));
  };
  
  const isSubmitDisabled = (!userInput.trim() && !files.image && !files.document && !files.audio) || isLoading;

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-gray-200">Your Raw Input</h2>
      <p className="text-sm text-gray-500 mt-1 mb-4">Provide any combination of text, image, document, or audio.</p>
      
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter your raw request, question, or goal..."
        className="w-full h-40 p-3 bg-gray-900/70 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-300 placeholder-gray-500"
      />

      <FileInput id="image" label="Image Input (Optional)" Icon={ImageIcon} file={files.image} onFileChange={handleFileChange} onRemoveFile={handleRemoveFile} accept="image/*" />
      <FileInput id="document" label="Document Input (Optional)" Icon={DocumentIcon} file={files.document} onFileChange={handleFileChange} onRemoveFile={handleRemoveFile} accept=".pdf,.doc,.docx,.txt" />
      <FileInput id="audio" label="Audio Input (Optional)" Icon={AudioIcon} file={files.audio} onFileChange={handleFileChange} onRemoveFile={handleRemoveFile} accept="audio/*" />

      <button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full mt-6 py-3 px-4 flex items-center justify-center gap-2 text-white font-semibold bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Optimizing...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Optimize Prompt
          </>
        )}
      </button>
    </div>
  );
};

export default InputSection;
