import React, { useState } from "react";
import { tokens } from "../../../theme";
import { TextField, useTheme} from "@mui/material";
import Button from "../../components/Button";

const Password = () => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = () => {
    // Add your update password logic here
    console.log("Updating password...");
  };

  return (
    <div className="w-full flex justify-ce "  >
      <div className=" w-full  ">
       
          <h2 className='text-xl font-semibold mb-4' style={{color: colors.text.primary}}>Update Password</h2>
          <div className="md:w-1/2 w-full">
            <TextField
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            sx={{ mb: 4 }}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            sx={{ mb: 4 }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            sx={{ mb: 4 }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            text=" UPDATE PASSWORD"
            
            onClick={handleUpdatePassword}
          />
           
          
   
          </div>
      </div>
    </div>
  );
};

export default Password;
