import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";
import { TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { Box } from "@mui/material";
import getLocationAndTimezone from "../utils/location";

const initialValues = {
  email: "",
  password: "",
};

const userSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { login } = useContext(AuthContext);
  const { loadProfile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogin = async (values) => {
    try {
      const response = await fetch("https://kommitly-backend.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        await login(data.access);
        await loadProfile();
        getLocationAndTimezone();
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      setMessage("Error logging in. Try again.");
    }
  };

  return (
    <div className="flex w-full bg-[#FBF9FF] rounded-xl flex-col items-center">
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
                    sx={{ gridColumn: "span 4",  }}
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
                <Box display="flex" justifyContent="center" mt="20px" width="100%">
                  <Button type="submit" color="secondary" variant="contained" sx={{ width: "100%", padding: 1.5 }}>
                    Login
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
