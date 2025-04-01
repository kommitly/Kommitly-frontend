import React, { useState, useContext } from 'react';
import { useLocation } from "react-router-dom";
import { ProfileContext } from '../../../context/ProfileContext';
import { Box, Button, Typography, useTheme, Modal } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { tokens } from "../../../theme";

const Profile = () => {
    const location = useLocation();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { profile } = useContext(ProfileContext);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://kommitly-backend.onrender.com/api/users/delete-profile/", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Account deleted successfully");
                localStorage.removeItem("token");
                window.location.href = "/"; // Redirect to homepage or login
            } else {
                alert("Failed to delete account");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred. Please try again.");
        } finally {
            handleClose();
        }
    };

    return (
        <div className='w-full flex justify-center'>  
            <Card className='mb-6 w-10/12 p-4'>
                <h2 className='text-xl font-semibold mb-4'>Personal Details</h2>
                {profile.user && (
                    <div className='space-y-4 w-6/12'>
                        <div className='flex space-x-8 pb-2'>
                            <span className='font-medium w-26'>First Name</span>
                            <span>{profile.user.first_name}</span>
                        </div>
                        <div className='flex space-x-8 pb-2'>
                            <span className='font-medium w-26'>Last Name</span>
                            <span>{profile.user.last_name}</span>
                        </div>
                        <div className='flex space-x-8'>
                            <span className='font-medium w-26'>Email</span>
                            <span>{profile.user.email}</span>
                        </div>
                    </div>
                )}

                <div>
                    <Button
                        variant="contained"
                        sx={{ marginTop: 4, backgroundColor: colors.background.warning }}
                        onClick={handleOpen}
                    >
                        Delete Account
                    </Button>   
                </div>
            </Card>

            {/* Confirmation Modal */}
            <Modal open={open} onClose={handleClose}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
                    <Typography variant="h5" sx={{mb:4}}>Are you sure you want to delete your account?</Typography>
                    <div className="flex justify-between space-x-4">
                        <Button variant="contained" sx={{backgroundColor: colors.background.warning}} onClick={handleDeleteAccount}>
                            Yes, Delete
                        </Button>
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default Profile;
