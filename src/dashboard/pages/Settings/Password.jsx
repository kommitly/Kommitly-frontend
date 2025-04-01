import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button } from "@mui/material";

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = () => {
    // Add your update password logic here
    console.log("Updating password...");
  };

  return (
    <div className="w-full flex justify-center "  >
      <Card className="w-10/12  p-6 shadow-lg rounded-2xl">
        <CardContent className="flex flex-col w-6/12">
          <Typography variant="h3" className=" font-semibold" sx={{ mb: 4 }}>
            Update Password
          </Typography>

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
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 , width: '50%'}}
            onClick={handleUpdatePassword}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Password;
