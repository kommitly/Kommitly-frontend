import React from 'react'
import { useDashboardStats } from "../../context/DashboardStatsContext";
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import Box from '@mui/material/Box';
import { areaElementClasses, lineElementClasses } from '@mui/x-charts/LineChart';
import { chartsAxisHighlightClasses } from '@mui/x-charts/ChartsAxisHighlight';
import useMediaQuery from '@mui/material/useMediaQuery';

const GoalCards = () => {
    const { stats, loading, error } = useDashboardStats();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isXs = useMediaQuery(theme.breakpoints.only("xs"));

    if (loading) return <div>Loading…</div>;
    if (error) return <div>Error loading stats</div>;

    // Prepare sparkline data: only progress values
    const sparkData = stats.goal_progress.map(g => g.progress);

    return (
        <div className="md:mt-4 mt-8 mb-8 md:mb-0 flex  flex-col gap-4">
            <div className='w-full h-24 flex gap-4'>
                <div 
                    className="w-4/12  flex flex-col justify-center items-center rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                    style={{ backgroundColor: colors.primary[200] }}
                >
                    <span className="text-2xl mt-4">{stats.current_streak} 🔥</span>
                    <span className="text-xs mt-2 font-regular" style={{color: colors.background.sidebar}}>Current Streak</span>
                </div>
                <div 
                    className="w-4/12 flex flex-col justify-center items-center rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                    style={{ backgroundColor: colors.primary[300] }}
                >
                    <span className="text-2xl mt-4">{stats.longest_streak} 🏆</span>
                    <span className='w-full flex justify-center items-center'>
     <Typography variant="body2"  sx={{color: "#fff"}}>
                    Longest Streak
                </Typography>

</span>
                </div>
              {/* Sparkline chart for goals */}
            <Box className="w-6/12 h-24  p-2   rounded-xl shadow-md" style={{ backgroundColor: colors.primary[400] }}>
                
             <div className='w-full flex flex-col  justify-center items-center'>
                  <SparkLineChart
  data={sparkData}
  width={isXs ? 120 : 220}
  height={60}
  area
  showHighlight
  color={colors.primary[500]}
  sx={{
    [`& .${areaElementClasses.root}`]: { opacity: 0.2 },
    [`& .${lineElementClasses.root}`]: { strokeWidth: 2 },
    [`& .${chartsAxisHighlightClasses.root}`]: {
      stroke: colors.primary[600],
      strokeDasharray: 'none',
      strokeWidth: 1.5,
    },
  }}
  clipAreaOffset={{ top: 2, bottom: 2 }}
  axisHighlight={{ x: 'line' }}
/>

<span className='w-full flex justify-center items-center'>
     <Typography variant="body2" sx={{color: "#fff"}}>
                    Goal Progress
                </Typography>

</span>
             </div>
               
            </Box>

            </div>

          
        </div>
    );
}

export default GoalCards;
