import React from 'react';
import { useTheme } from '@mui/material/styles';
import LightModeImg from '../../assets/logoLight2.svg';
import DarkModeImg from '../../assets/logoDark.svg';

const RegistrationPhoto = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <div className="flex justify-center items-center">
      <img
        src={isDarkMode ? DarkModeImg : LightModeImg}
        alt="Registration illustration"
        className="w-full h-auto max-w-lg"
      />
    </div>
  );
};

export default RegistrationPhoto;
