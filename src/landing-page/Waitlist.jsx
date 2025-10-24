import React, { useState } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import success from "../assets/success.svg";

const Waitlist = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section
      className="rounded-t-4xl justify-center items-center pb-8 flex flex-col md:px-6 px-2 w-full"
     
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
          py: 10,
        }}
      >
        {!submitted ? (
          <>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: colors.background.default }}
            >
              Be the First to Experience Kommitly
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 3,
              }}
            >
              Join our waitlist for an exclusive demo when we launch. Get early access
              to Kommitly’s intelligent goal management platform.
            </Typography>

            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem" }}>
              <TextField
                variant="outlined"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={{
                  input: { color: colors.text.placeholder },
                  fieldset: { borderColor: colors.primary[500] },
                }}
              />
              <button
              className="bg-[#6F2DA8] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#4F378A] transition 2xl:text-xl xl:text-base lg:text-base"
              >
                Subscribe
              </button>
            </form>
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center">
            <img src={success} alt="success" width={100} className="mb-4" />
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: colors.primary[500], mb: 1 }}
            >
              You’re on the list!
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              We’ll notify you when your exclusive demo is ready.
            </Typography>
          </Box>
        )}
      </Box>
    </section>
  );
};

export default Waitlist;
