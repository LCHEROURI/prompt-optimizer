
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import { optimizePrompt } from './services/geminiService';

type FilesState = {
  image: File | null;
  document: File | null;
  audio: File | null;
};

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [files, setFiles] = useState<FilesState>({
    image: null,
    document: null,
    audio: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = useCallback(async () => {
    if (!userInput.trim() && !files.image && !files.document && !files.audio) {
      setError('Please provide some input before optimizing.');
      return;
    }

    setIsLoading(true);
    setOutput('');
    setError('');

    try {
      const result = await optimizePrompt(userInput, files.image, files.document, files.audio);
      if (result.startsWith('Error:')) {
        setError(result);
      } else {
        setOutput(result);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(`Failed to get response from AI: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, files]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <InputSection
            userInput={userInput}
            setUserInput={setUserInput}
            files={files}
            setFiles={setFiles}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <OutputSection
            output={output}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
