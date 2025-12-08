// src/components/common/LanguageSelector.jsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'TypeScript', value: 'typescript' }
];

const LanguageSelector = ({ value, onChange }) => (
  <FormControl fullWidth size="small">
    <InputLabel>Language</InputLabel>
    <Select value={value} label="Language" onChange={(e) => onChange(e.target.value)}>
      {languages.map((lang) => (
        <MenuItem key={lang.value} value={lang.value}>
          {lang.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default LanguageSelector;
