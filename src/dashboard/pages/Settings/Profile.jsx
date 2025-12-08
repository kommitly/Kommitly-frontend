import React, { useState, useContext } from 'react';
import { useLocation } from "react-router-dom";
import { ProfileContext } from '../../../context/ProfileContext';
import { Box, Button, Typography, useTheme, Modal } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { tokens } from "../../../theme";
import {updateUserProfile} from "../../../utils/Api"
import { FaRegTrashCan } from "react-icons/fa6";
import CustomButton from "../../components/Button"
import useMediaQuery from "@mui/material/useMediaQuery";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Profile = () => {
    const location = useLocation();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { profile } = useContext(ProfileContext);
    const [firstName, setFirstName] = useState(profile.user?.first_name || "");
    const [lastName, setLastName] = useState(profile.user?.last_name || "");
    const [email, setEmail] = useState(profile.user?.email || "");
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
      

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

    const handleUpdate = async () => {
    try {
        setLoading(true);
        const updatedData = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
        };

        await updateUserProfile(updatedData);
    
        setOpenSnackbar(true);
        window.location.reload();
    } catch (error) {
        alert(error.response?.data?.email || "Failed to update profile");
    } finally {
        setLoading(false);
    }
};





    return (
        <div className='w-full  flex justify-center'>  
            <div className='w-full flex flex-col'>

            <div className='flex w-full justify-between items-center mb-4'>
                    <h2 className='md:text-xl text-base font-semibold '  style={{color: colors.text.primary}}>Personal Details</h2>
                <div className='hidden md:inline  w-auto '>
                <div className=' flex space-x-2 justify-center items-center'>
                       <CustomButton
        variant="contained"
        sx={{ backgroundColor: colors.background.success }}
        onClick={handleUpdate}
        disabled={loading}
        text={loading ? "Updating..." : "Update Profile"} 
    >
     
    </CustomButton>

                    <button
                   

                        onClick={handleOpen}
                    >
                        <FaRegTrashCan size={24}    style={{  color: colors.background.warning }}/>
                      
                    </button>   

                </div>
                 
                </div>
            </div>
                {profile.user && (
                    <div className='space-y-4 md:w-6/12 w-full'>
                        <div className='flex space-x-8 pb-2'>
                            <span className='font-medium  md:w-26 w-24 md:text-sm text-xs '  style={{color: colors.text.primary}}>First Name</span>
                             <input
                                    className="border px-2 py-1 rounded w-full focus:outline-[#6D5BA6]  bg-transparent md:text-sm text-xs"
                                    value={firstName}
                                     style={{color: colors.text.primary}}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                        </div>
                        <div className='flex space-x-8 pb-2'>
                            <span className='font-medium md:w-26 w-24 md:text-sm text-xs'  style={{color: colors.text.primary}}>Last Name</span>
                            <input
            className="border px-2 py-1 rounded w-full  bg-transparent md:text-sm text-xs focus:outline-[#6D5BA6]"
            value={lastName}
             style={{color: colors.text.primary}}
            onChange={(e) => setLastName(e.target.value)}
        />
                        </div>
                        <div className='flex space-x-8'>
                            <span className='font-medium md:w-26 w-24 md:text-sm text-xs focus:outline-[#6D5BA6]'  style={{color: colors.text.primary}}>Email</span>
                             <input
        className="border px-2 py-1 rounded w-full bg-transparent md:text-sm text-xs focus:outline-[#6D5BA6]"
        value={email}
         style={{color: colors.text.primary}}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
    />
                        </div>
                    </div>
                )}

                 
            {isSm && (
                 <div className='flex w-full  space-x-2 justify-end mt-6 items-center'>
                    <CustomButton
        variant="contained"
        sx={{ backgroundColor: colors.background.success }}
        onClick={handleUpdate}
        disabled={loading}
        text={loading ? "Updating..." : "Update Profile"} 
    >
     
    </CustomButton>

                    <button
                   

                        onClick={handleOpen}
                    >
                        <FaRegTrashCan size={24}    style={{  color: colors.background.warning }}/>
                      
                    </button>   
                </div>


            )}

            <Snackbar
                                                open={openSnackbar}
                                                autoHideDuration={3000}
                                                onClose={() => setOpenSnackbar(false)}
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                              >
                                                <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                                                  Profile successfully updated!
                                                </MuiAlert>
                                              </Snackbar>

                
            </div>
          

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
