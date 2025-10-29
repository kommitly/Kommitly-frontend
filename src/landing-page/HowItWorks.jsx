import React from 'react'
import { Typography, Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { tokens } from '../theme'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const HowItWorks = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const steps = [
    {
      number: '01',
      title: 'Set Your Goal',
      description:
        'Start with what you want to achieve, big or small. Kommitly captures your idea in seconds.',
    },
    {
      number: '02',
      title: 'Let Kommitly Plan It',
      description:
        'Kommitly breaks down your goal into clear, actionable steps, no overthinking required.',
    },
    {
      number: '03',
      title: 'Take Action & Track Progress',
      description:
        'Stay focused on the one thing that matters right now. Watch your goals turn into finished work.',
    },
  ]

  return (
    <section className="flex bg-white  flex-col items-center justify-center  md:p-8 p-4 w-full">
      <div className='p-4 mb-16'>
        <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          color: colors.text.primary,
          mb: 8,
          mt:4,
          fontSize: { xs: '1.75rem', md: '2rem' },
          textAlign: 'center',
        }}
      >
        How Kommitly Works
      </Typography>

     
      <Box
        className="grid grid-cols-1 md:grid-cols-3 gap-10"
        sx={{ width: '100%', maxWidth: '1000px' }}
      >
        {steps.map((step, index) => (
          <Box
            key={index}
            className="flex flex-col items-center text-center p-6 rounded-4xl shadow-md"
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark' ? colors.menu.primary : colors.background.paper,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)' },
            }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 40, color: colors.primary[500], mb: 2 }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: colors.text.primary,
                mb: 1,
              }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="body"
              sx={{
                color: colors.text.secondary,
                lineHeight: 1.6,
                maxWidth: '280px',
              }}
            >
              {step.description}
            </Typography>
          </Box>
        ))}
      </Box>
      </div>
    </section>
  )
}

export default HowItWorks
