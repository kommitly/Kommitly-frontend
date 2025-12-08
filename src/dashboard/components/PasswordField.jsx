import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField = ({ value, onChange, onBlur, name, error, helperText, label="Password" }) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      fullWidth
      type={visible ? "text" : "password"}
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setVisible(!visible)} edge="end">
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        gridColumn: "span 4",
        "& input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
          transition: "background-color 9999s ease-in-out 0s",
        },
      }}
    />
  );
};

export default PasswordField;
