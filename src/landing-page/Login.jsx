import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";
import { TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Box } from "@mui/material";
import getLocationAndTimezone from "../utils/location";

import { motion } from "framer-motion";

const initialValues = {
  email: "",
  password: "",
};

const userSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const Login = ({ submitting, setSubmitting }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { login, loading, user } = useContext(AuthContext);
  const { loadProfile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

    // redirect if logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard/home");
    }
  }, [user, loading, navigate]);

 

  const handleLogin = async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("https://kommitly-backend.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        await login(data.access);
        // await loadProfile();
        getLocationAndTimezone();
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      setMessage("Error logging in. Try again.");
    }
    finally {
    setSubmitting(false);
  }
  };

 

  return (
    <div className="flex w-full  rounded-xl flex-col items-center">
      <div className="flex w-full flex-col  items-center">
        <div className="flex w-10/12 flex-col gap-4 justify-center ">
         
          {message && <p style={{color:colors.background.warning}}>{message}</p>}
          <Formik onSubmit={handleLogin} initialValues={initialValues} validationSchema={userSchema}>
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4,minmax(0,1fr))"
                  sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 4", "& .MuiFilledInput-root": {
  backgroundColor: "#f5f5f5",
  "&:hover": {
    backgroundColor: "#ebebeb",
  },
  "&.Mui-focused": {
    backgroundColor: "#e0e0e0",
  },
  input: {
    color: "#333",
  },
},
  }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
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
                <div className="w-full flex justify-end mt-3">
                  <Link>
                  <p className="text-xs font-medium " style={{color: colors.primary[500]}}>
                    Forgot password?</p></Link>

                </div>
                <Box display="flex" justifyContent="center" mt="20px" width="100%">
                  <Button type="submit"  sx={{ width: "100%", padding: 1.5, backgroundColor: colors.primary[500], color:"#FFFFFF" }}>
                   <span > Login</span>
                  </Button>
                </Box>
              </form>
              
            )}
          </Formik>

            <div className="w-full flex justify-center mt-3">
                  <Link className="flex gap-2"
                       to="/registration?tab=signup">
                  <p className="text-xs " style={{color: colors.text.primary}}>
                    Dont have an account?</p>
                    <span  className="text-xs font-semibold " style={{color: colors.text.secondary}} >Sign up</span></Link>

                </div>
        
        </div>
      </div>
    </div>
  );
};

export default Login;
