// src/components/editor/CodeEditor.jsx
import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({
  language = 'javascript',
  theme = 'vs-dark',
  value = '',
  onChange,
  readOnly = false
}) => {
  return (
    <Editor
      height="80vh"
      language={language}
      value={value}
      theme={theme}
      onChange={onChange}
      options={{
        readOnly,
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
