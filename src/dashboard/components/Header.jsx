import React from "react";
import { Typography, Box, useTheme } from "@mui/material";
import {tokens } from "../../theme";

const Header = ({title, subtitle}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box mb="30px">
            <Typography 
            variant="h3" 
            color={colors.text.primary} 
            fontWeight="bold" 
            sx={{mb: "5px"}}
            >{title}</Typography>
        <Typography variant="h5" color={colors.text.secondary}>
            {subtitle}
        </Typography>
    </Box>)
}

export default Header;