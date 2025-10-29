
import React, { useState, useEffect, useMemo } from 'react';
import { OptimizedOutput } from '../types';
import Spinner from './Spinner';
import { ClipboardIcon } from './IconComponents';

interface OutputSectionProps {
  output: string;
  isLoading: boolean;
  error: string;
}

const OutputSection: React.FC<OutputSectionProps> = ({ output, isLoading, error }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const parsedOutput: OptimizedOutput | null = useMemo(() => {
    if (!output) return null;
    
    const parts = output.split('**Implementation Notes:**');
    if (parts.length < 2) return null;
    
    const promptText = parts[0].replace('**Optimized Prompt:**', '').trim();
    const notesText = parts[1].trim();

    return { prompt: promptText, notes: notesText };
  }, [output]);

  const handleCopy = () => {
    if (parsedOutput?.prompt) {
      navigator.clipboard.writeText(parsedOutput.prompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <Spinner />
          <p className="mt-4 text-lg">Lyra is thinking...</p>
          <p className="text-sm text-gray-500">Optimizing your prompt based on the provided inputs.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 p-4 bg-red-900/20 rounded-lg">
           <h3 className="font-semibold mb-2">An Error Occurred</h3>
           <p className="text-sm text-center">{error}</p>
        </div>
      );
    }

    if (parsedOutput) {
      return (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-400">Optimized Prompt</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                <ClipboardIcon className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-gray-900/70 border border-gray-600 rounded-md whitespace-pre-wrap font-mono text-sm text-gray-300">
              {parsedOutput.prompt}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Implementation Notes</h3>
            <div className="p-4 bg-gray-900/70 border border-gray-600 rounded-md whitespace-pre-wrap text-sm text-gray-300">
              {parsedOutput.notes}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Your optimized prompt will appear here.</p>
      </div>
    );
  };
  
  return (
     <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 min-h-[500px] lg:min-h-0 flex flex-col mt-8 lg:mt-0">
       <h2 className="text-xl font-semibold text-gray-200 mb-4 flex-shrink-0">Lyra's Output</h2>
       <div className="flex-grow">
          {renderContent()}
       </div>
     </div>
  );
};

export default OutputSection;
