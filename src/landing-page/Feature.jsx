import React from 'react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InsightsIcon from '@mui/icons-material/Insights';

const Feature = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const features = [
    {
      icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: colors.primary[300] }} />,
      title: 'Smart Goal Breakdown',
      desc: 'Kommitly transforms your goals into structured, achievable steps, no overwhelm, just clarity and momentum.'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40, color: colors.primary[300] }} />,
      title: 'Seamless Scheduling',
      desc: 'Your priorities are intelligently scheduled so you always know what to focus on next and when to do it.'
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40, color: colors.primary[300] }} />,
      title: 'Progress Insights',
      desc: 'Track your growth with visual insights that show how far you’ve come and what’s working best for you.'
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: colors.primary[300] }} />,
      title: 'Completion Made Rewarding',
      desc: 'Every completed task feels satisfying, Kommitly celebrates progress, not perfection.'
    },
  ];

  return (
    <section className="flex flex-col md:px-6 px-2 py-20">
      <Typography 
        variant="h3" 
        component="h2" 
        sx={{ 
          fontWeight: 'semibold', 
          color: "#FFFFFF",
          textAlign: 'center',
          mb: 6,
          fontSize: { xs: '1.75rem', md: '2.25rem' }
        }}
      >
        💡 Designed to Keep You Moving Forward
      </Typography>

      <Box 
        className="grid  md:p-12 p-4 grid-cols-1 md:grid-cols-4 gap-8 md:gap-12"
        
      >
        {features.map((feature, index) => (
          <Box 
            key={index}
            className="p-6 rounded-4xl border shadow-lg transition-transform transform hover:scale-105"
          sx={{borderColor: "#4F378A"}}
          >
            <Box className="mb-4">{feature.icon}</Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: "#FBF9FF",
                mb: 2 
              }}
            >
              {feature.title}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#FBF9FF", 
                lineHeight: 1.8 
              }}
            >
              {feature.desc}
            </Typography>
          </Box>
        ))}
      </Box>
    </section>
  );
};

export default Feature;
