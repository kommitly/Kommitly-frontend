import React from 'react';
import ReactMarkdown from 'react-markdown';
import {useTheme } from "@mui/material";
import { tokens } from "../../theme";

const AiAssistance = ({ answer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="p-4  rounded-lg shadow-md text-sm " style={{ backgroundColor: colors.background.default, color: colors.text.primary }}>
      {answer ? (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      ) : (
        <p className="text-gray-400 italic">No AI answer available yet.</p>
      )}
    </div>
  );
};

export default AiAssistance;
