import * as React from 'react';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import dayjs from 'dayjs';

function ButtonField(props) {
  const {
    setOpen,
    label,
    id,
    disabled,
    InputProps: { ref } = {},
    inputProps: { 'aria-label': ariaLabel } = {},
  } = props;

  return (
    <Button
    id={id}
    disabled={disabled}
    ref={ref}
    aria-label={ariaLabel}
    onClick={() => setOpen?.((prev) => !prev)}
    sx={{ minWidth: "auto", padding: 0, color: "#4F378A", 
      fontSize: {
        xs:"10px", sm:"10px", md:"10px", lg:"12px", xl:"12px"
        } }} // Optional: removes default button padding
    >
      {label ? ` ${label}` : (
        <>
      
         <svg
         xmlns="http://www.w3.org/2000/svg"
         width="20"
         height="20"
         viewBox="0 0 24 24"
         fill="none"
         stroke="#65558F"
         strokeWidth="3"
         strokeLinecap="round"
         strokeLinejoin="round"
         className="text-[#65558F] "
       >
         <rect x="3" y="4" width="18" height="5" fill="#65558F" stroke="#65558F"></rect>
         <rect x="3" y="10" width="18" height="12" stroke="#65558F" fill="none" strokeWidth="2" />
         <line x1="16" y1="2" x2="16" y2="6"></line>
         <line x1="8" y1="2" x2="8" y2="6"></line>
         <circle cx="10" cy="16" r="1" fill="#65558F"></circle>
       </svg>
       </>
        
      )}
    </Button>
  );
}

function ButtonDatePicker(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <DateTimePicker
      slots={{ ...props.slots, field: ButtonField }}
      slotProps={{ ...props.slotProps, field: { setOpen } }}
      {...props}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    />
  );
}

export default function SubtaskDateTimePicker({ value, onChange }) {
 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ButtonDatePicker
        label={value ? dayjs(value).format('MM/DD/YYYY h:mm A') : null}
        value={value}
         onChange={onChange}
      />
    </LocalizationProvider>
  );
}
