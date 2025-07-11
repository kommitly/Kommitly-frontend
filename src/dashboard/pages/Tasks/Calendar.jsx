// CalendarComponent.jsx
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";


const CalendarComponent = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
    const theme = useTheme();
    const colors =tokens(theme.palette.mode);
  

  // Handle date selection
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    onDateChange(newDate); // Send date to parent
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex items-center rounded-xl shadow-lg" style={{ 
        backgroundColor: colors.background.default
        
         }} >
         <DateCalendar
          value={selectedDate}
          onChange={handleDateChange}
          sx={{
            width: '80%',
            minWidth: '50px',
            '& .MuiDayCalendar-weekContainer': {
              justifyContent: 'space-between',
            },
            '& .MuiDayCalendar-weekDayLabel': {
              flex: 1,
              textAlign: 'center',
              fontWeight: 500,
              fontSize: '0.9rem',
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
};

export default CalendarComponent;
