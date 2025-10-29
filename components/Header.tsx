
import React from 'react';
import { SparklesIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 border-b border-gray-700/50">
      <div className="flex items-center justify-center gap-3">
        <SparklesIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 tracking-tight">
          Lyra
        </h1>
      </div>
      <p className="mt-2 text-md md:text-lg text-gray-400">
        Multimodal Prompt Optimizer
      </p>
    </header>
  );
};

export default Header;
