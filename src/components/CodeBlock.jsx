import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

const CodeBlock = ({ code, language, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block rounded-lg overflow-hidden">
      {filename && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm flex justify-between items-center">
          <span>{filename}</span>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
            title={copied ? '已复制' : '复制代码'}
          >
            {copied ? (
              <CheckIcon className="h-5 w-5 text-green-500" />
            ) : (
              <DocumentDuplicateIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={coldarkDark}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '0.9rem',
          borderRadius: filename ? '0 0 0.5rem 0.5rem' : '0.5rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock; 