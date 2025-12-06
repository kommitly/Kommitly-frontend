import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import { tokens } from "../theme";
import getLocationAndTimezone from "../utils/location";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { TextField} from "@mui/material";
import {Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { use } from "react";
import Button from "../dashboard/components/Button"
import Lottie from "lottie-react";
import emailVerification from "../animations/email_verification.json"; // Adjust path if needed



const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  timezone: "Africa/Nairobi",
  
};

const userSchema = yup.object().shape({
  first_name: yup.string().required("required"),
  last_name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup
  .string()
  .min(8, "Password must be at least 8 characters")
  .required("required"),

  
});



const Signup = ({message, setMessage}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  const handleFormSubmit = async (values) => {
    try {
      const response = await fetch("https://kommitly-backend.onrender.com/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok) {
        setDialogOpen(true);
        setEmail(values.email);
        setPassword(values.password);
        setIsCheckingVerification(true);
        getLocationAndTimezone();

      } else {
        
              // Extract first error message if it's a validation dict
          const errorMsg =
            data.error ||
            (data.email && data.email[0]) ||
            (typeof data === "object" ? Object.values(data).flat()[0] : null) ||
            "Signup failed. Try again.";

          setMessage(errorMsg);
          console.log("Signup error:", errorMsg);
      }
    } catch (error) {
      setMessage("Error signing up. Please try again.");
    }
  };

 
  useEffect(() => {
    let interval;
    if (isCheckingVerification) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`https://kommitly-backend.onrender.com/api/users/check-verification-status/${email}/`);
          if (!res.ok) throw new Error("Failed to check verification status");
  
          const data = await res.json();
          console.log("Verification status data:", data); // Debugging line
          if (data.verified === true && data.token) { // Check for verified and a token
            clearInterval(interval);
            login(data.token); // Use the token from the backend response
            setIsCheckingVerification(false); // Stop polling
          // The navigate("/dashboard/home") is handled by the login function in AuthProvider
        } else if (data.verified === true && !data.token) {
            // This case handles a scenario where verified but token isn't immediately available
            // You might want to attempt a login with credentials or show a message.
            // For now, let's assume if verified, token should be there.
            console.warn("User verified but no token received. Attempting login with credentials if possible or redirect to login.");
            clearInterval(interval);
            setIsCheckingVerification(false);
            navigate("/login"); // Redirect to login if token isn't provided directly
        }
        } catch (error) {
          console.error("Error checking verification status:", error);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isCheckingVerification, email, password, navigate]);

 
 
  return (
    <div className="flex w-full   flex-col items-center  ">
          <div className="flex w-full flex-col  items-center">
        <div className="flex  md:w-10/12 w-11/12 flex-col gap-4 justify-center ">
   

 
      
     

        <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
        >
            {({
                values,
                errors, 
                touched, 
                handleBlur, 
                handleChange, 
                handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
              <Box 
              display="grid" 
              gap="30px" 
              gridTemplateColumns="repeat(4,minmax(0,1fr))"
              
              >
                  <TextField 
                  fullWidth
                
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.first_name}
                  name="first_name"
                  error={!!touched.first_name && !!errors.first_name}
                  helperText={touched.first_name && errors.first_name}
                  sx={{gridColumn:  "span 2" }}
               

                  />
                    <TextField 
                        fullWidth
                        
                        type="text"
                        label="Last Name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.last_name}
                        name="last_name"
                        error={!!touched.last_name && !!errors.last_name}
                        helperText={touched.last_name && errors.last_name}
                        sx={{ gridColumn: "span 2" }}
                  
                        />
                        <TextField
                        fullWidth
                        
                        type="text"
                        label="Email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        name="email"
                        error={!!touched.email && !!errors.email}
                        helperText={touched.email && errors.email}
                        sx={{ gridColumn: "span 4",
                          
                         }}
                        />
                        <TextField
                        fullWidth
                        
                        type="password"
                        label="Password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        name="password"
                        error={!!touched.password && !!errors.password}
                        helperText={touched.password && errors.password}
                        sx={{ gridColumn: "span 4" }}
                      
                        />



                    </Box>
                    <Box display="flex" justifyContent="center" mt="40px" width="100%"  >
                        
                             <button type="submit"   className={`bg-[#4F378A] w-full text-white px-4 md:py-2 py-2 text-xs  md:rounded-sm rounded-sm shadow-lg hover:bg-[#6F2DA8] transition 2xl:text-xl xl:text-base lg:text-base`}
    >
     Create New User
    </button>
                  
                    </Box>

                </form>
            )}
        </Formik>

            <div className="w-full flex justify-center mt-3">
                          <Link className="flex gap-2"
                               to="/registration?tab=login">
                          <p className="text-xs " style={{color: colors.text.primary}}>
                            Already have an account?</p>
                            <span  className="text-xs font-semibold " style={{color: colors.text.secondary}} >Login</span></Link>
        
                        </div>
      

      

    
          <Backdrop 
               sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={dialogOpen}
          onClick={() => setDialogOpen(false)}
          >
             <Box className=" w-11/12 space-y-4 p-4 bg-white max-h-full rounded-xl mt-4 " >
              <div className="flex   justify-center items-center">
            <div className=" w-full flex flex-col justify-center items-center p-6 rounded-md" style={{ color: colors.text.primary }}>
              <div className="w-full flex justify-center items-center">
                 <Lottie animationData={emailVerification} loop={true} style={{ width: 100, height: 100 }} />
              </div>
               <p className="flex text-center text-lg font-bold mb-2" style={{ color: colors.text.secondary }}>Signup Successful! </p>
             
              <p className="flex text-center">Please check your email to verify your account.</p>
             
            </div>
          </div>
             
             
             
             </Box>


          
          </Backdrop>
   
      </div>
      </div>
    </div>
  );
};

export default Signup;