import * as React from 'react';
import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { fetchGoals } from '../../../utils/Api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaChartBar, FaUser, FaTasks, FaCheck } from "react-icons/fa";
import dayjs from "dayjs";
import { PiChartBarFill } from "react-icons/pi";
import { motion } from "framer-motion";
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import Loading from "../../components/Loading";
import SlidingButton from "../../components/SlidingButton";
import { BorderAll } from "@mui/icons-material";
import { BarChart } from '@mui/x-charts/BarChart';
import { animated, useSpring } from '@react-spring/web';

function getCompletionTrends(goals = [], view ) {
  const now = dayjs();
  let range = 7;
  let format = "ddd"; // e.g. Mon

  if (view === "monthly") {
    range = 30;
    format = "MMM D"; // e.g. Jun 5
  } else if (view === "yearly") {
    range = 12;
    format = "MMM"; // e.g. Jan
  }

  const trend = Array(range).fill(0).map((_, i) => ({
    name:
      view === "yearly"
        ? now.subtract(range - 1 - i, "month").format(format)
        : now.subtract(range - 1 - i, "day").format(format),
    value: 0,
  }));

  const incrementDayCount = (timestamp) => {
    if (!timestamp) return;
    const time = dayjs(timestamp);
    const label =
      view === "yearly"
        ? time.format("MMM")
        : view === "monthly"
        ? time.format("MMM D")
        : time.format("ddd");

    const index = trend.findIndex(item => item.name === label);
    if (index !== -1) trend[index].value += 1;
  };

  goals.forEach(goal => {
    goal.tasks?.forEach(task => {
      incrementDayCount(task.completed_at);
      task.subtasks?.forEach(subtask => incrementDayCount(subtask.completed_at));
    });
  });

  return trend;
}

function getAiCompletionTrends(ai_goals = [], aiView  ) {
 
  const now = dayjs();
  let range = 7;
  let format = "ddd"; // e.g. Mon

  if (aiView === "monthly") {
    range = 30;
    format = "MMM D"; // e.g. Jun 5
  } else if (aiView === "yearly") {
    range = 12;
    format = "MMM"; // e.g. Jan
  }


const trend = Array(range).fill(0).map((_, i) => ({
    name:
      aiView === "yearly"
        ? now.subtract(range - 1 - i, "month").format(format)
        : now.subtract(range - 1 - i, "day").format(format),
    value: 0,
  }));

  const incrementDayCount = (timestamp) => {
    if (!timestamp) return;
    const time = dayjs(timestamp);
    const label =
      aiView === "yearly"
        ? time.format("MMM")
        : aiView === "monthly"
        ? time.format("MMM D")
        : time.format("ddd");

    const index = trend.findIndex(item => item.name === label);
    if (index !== -1) trend[index].value += 1;
  };


  // AI goals
  ai_goals.forEach(goal => {
    goal.ai_tasks?.forEach(task => {
      incrementDayCount(task.completed_at);
      task.ai_subtasks?.forEach(subtask => incrementDayCount(subtask.completed_at));
    });
  });
  
  return trend;
}



export default function Stats() {
  
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartAiData, setChartAiData] = useState([]); // For AI goals if needed
  const [view, setView] = useState("weekly"); // options: "weekly", "monthly", "yearly"
  const [aiView, setAiView] = useState("weekly"); // options: "weekly", "monthly", "yearly"
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSm = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size
  const [key, animate] = React.useReducer((v) => v + 1, 0);

  useEffect(() => {
  const getGoals = async () => {
    try {
      const response = await fetchGoals();
      const fetchedGoals = response.goals || [];
      const fetchedAiGoals = response.ai_goals || [];

      setGoals([...fetchedGoals, ...fetchedAiGoals]); // for stat cards
     
      setChartData(getCompletionTrends(fetchedGoals, view));
      setChartAiData(getAiCompletionTrends(fetchedAiGoals, aiView)); // AI goals trends
    } catch (error) {
      console.error("Failed to fetch goals", error);
    } finally {
      setLoading(false);
    }
  };
  getGoals();
}, [view, aiView]);


  const regularGoals = goals.filter(goal => goal.tasks); // only those with .tasks
  const aiGoals = goals.filter(goal => goal.ai_tasks); // only those with .ai_tasks

  // Derive stats from fetched data
  const totalGoals = regularGoals.length + aiGoals.length;
  const completedGoals = regularGoals.filter(goal => goal.progress === 100).length + aiGoals.filter(goal => goal.progress === 100).length;

  const allTasks = regularGoals.flatMap(goal => goal.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === "completed").length;
  const allAiTasks = aiGoals.flatMap(goal => goal.ai_tasks);
  const totalAiTasks = allAiTasks.length;
  const completedAiTasks = allAiTasks.filter(task => task.status === "completed").length
  const totalSubtasks = allTasks.flatMap(task => task.subtasks).length;
  const completedSubtasks = allTasks.flatMap(task => task.subtasks).filter(subtask => subtask.status === "completed").length;
  const totalAiSubtasks = allAiTasks.flatMap(task => task.ai_subtasks).length;
  const completedAiSubtasks = allAiTasks.flatMap(task => task.ai_subtasks).filter(subtask => subtask.status === "completed").length;
  const totalTasksCount = totalTasks + totalAiTasks;
  const completedTasksCount = completedTasks + completedAiTasks;
  const totalSubtasksCount = totalSubtasks + totalAiSubtasks;
  const completedSubtasksCount = completedSubtasks + completedAiSubtasks;

  if (loading) {
    return (
         <>
         <Loading/>
         </>
      
    );
  }


  function AnimatedBarLabel(props) {
  const {
    seriesId,
    dataIndex,
    color,
    isFaded,
    isHighlighted,
    classes,
    xOrigin,
    yOrigin,
    x,
    y,
    width,
    height,
    layout,
    skipAnimation,
    ...otherProps
  } = props;

  const style = useSpring({
    from: { y: yOrigin },
    to: { y: y - 4 },
    config: { tension: 100, friction: 10 },
  });

  return (
    <animated.text
      {...otherProps}
      // @ts-ignore
      fill={color}
      x={xOrigin + x + width / 2}
      width={width}
      height={height}
      style={style}
      textAnchor="middle"
    />
  );
}


  return (
    <div className="p-2 space-y-6 ">
      <span className="flex items-center space-x-2 mb-4">
          <PiChartBarFill size={24} className="text-[#4F378A]"/>
      <h1 className="md:text-2xl text-xl  font-semibold"> Progress Overview</h1>

      </span>
     
          {/* Stat Cards */}
          <div className="grid mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<FaUser />} title="Goals Created" value={totalGoals} />
            <StatCard icon={<FaCheck />} title="Goals Completed" value={completedGoals} />
            <StatCard icon={<FaTasks />} title="Tasks Created" value={totalTasksCount} />
            <StatCard icon={<FaCheck />} title="Tasks Completed" value={completedTasksCount} />
          </div>

        <div className='w-full md:flex gap-4 h-full'>
               {/* AI Goals Chart */}
          {chartAiData.length > 0 && (
              <Card className="mt-6 w-full h-full">
            <CardContent className=" h-auto  w-full">
              <div className="md:mb-2 mb-0    w-full justify-between items-center">
              {/* {<h2 className="text-lg font-semibold mb-2">{aiView} AI Goal Activity</h2>} */}
              <h2 className="text-lg font-semibold "> AI Goal Activity</h2>
               
            <div className='w-full -mt-4 flex justify-end'>
                 <SlidingButton
  options={["weekly", "monthly", "yearly"]}
  selected={aiView}
  onChange={setAiView}
/>
            </div>

         

                
                  
               
                          

             </div>
            
  <BarChart
    key={key}
    dataset={chartAiData} // your [{ name: "...", value: ...}, ...]
    xAxis={[{ scaleType: "band", dataKey: "name" }]} // ✅ band scale
    series={[{ dataKey: "value", label: "Value" }]} // ✅ tells it which value to plot
    colors={[colors.primary[500]]}
    width={isSm ? 360: 420}
    height={400}
    margin={{left: isSm ? 30 : 30}}
    borderRadius={6}
    barLabel="value"
    slots={{ barLabel: AnimatedBarLabel }}

  />



            </CardContent>
          </Card>
          )}



          {/* Chart */}


          {chartData.length > 0 && (
             <Card className="mt-6  w-full h-full mb-8">
            <CardContent className=" h-auto p-4">
             <div className="md:flex md:mb-2 mb-8  w-full justify-between items-center">
               {/* {<h2 className="text-lg font-semibold mb-2">{view} Goal Activity</h2>} */}
               <h2 className="text-lg font-semibold "> Goal Activity</h2>

               <SlidingButton
            options={["weekly", "monthly", "yearly"]}
            selected={view}
            onChange={setView}
          />

        

                 
                  
                  
                          


             </div>
             <BarChart
    key={key}
    dataset={chartData} // your [{ name: "...", value: ...}, ...]
    xAxis={[{ scaleType: "band", dataKey: "name" }]} // ✅ band scale
    series={[{ dataKey: "value", label: "Value" }]} // ✅ tells it which value to plot
    colors={[colors.primary[500]]}
    width={isSm ? 360: 420}
    height={400}
    margin={{left: isSm ? 30 : 30}}
    borderRadius={6}
    barLabel="value"
    slots={{ barLabel: AnimatedBarLabel }}

  />

            </CardContent>
          </Card>
          )}
        </div>
       

       
    
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <Card>
      <CardContent className="flex items-center space-x-4 p-4">
        <div className="text-[#4F378A] bg-[#A89FE3] p-2 rounded-sm text-xl">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
