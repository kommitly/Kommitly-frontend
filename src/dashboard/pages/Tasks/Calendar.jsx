// CalendarComponent.jsx
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

const CalendarComponent = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Handle date selection
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    onDateChange(newDate); // Send date to parent
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex items-center  bg-white rounded-xl shadow-lg">
        <DateCalendar value={selectedDate} onChange={handleDateChange} />
      </div>
    </LocalizationProvider>
  );
};

export default CalendarComponent;
