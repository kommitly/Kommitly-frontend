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


  return (
    <div className="p-6 space-y-6">
      <span className="flex items-center space-x-2 mb-4">
          <PiChartBarFill size={24} className="text-[#4F378A]"/>
      <h1 className="md:text-2xl text-xl  font-semibold"> Progress Overview</h1>

      </span>
      {loading ? (
     
              <div className='w-full mt-8 flex min-h-screen'>
              <div className="w-11/12 p-8 mt-8 py-8 flex-1 flex justify-center items-center overflow-y-auto scrollbar-hide max-h-[75vh] no-scrollbar">
              <motion.div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#65558F] rounded-full"
              initial={{ y: -10 }}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
        
              </div>
            </div>
         
       
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<FaUser />} title="Goals Created" value={totalGoals} />
            <StatCard icon={<FaCheck />} title="Goals Completed" value={completedGoals} />
            <StatCard icon={<FaTasks />} title="Tasks Created" value={totalTasksCount} />
            <StatCard icon={<FaCheck />} title="Tasks Completed" value={completedTasksCount} />
          </div>

             {/* AI Goals Chart */}
          {chartAiData.length > 0 && (
              <Card className="mt-6">
            <CardContent className="md:h-[300px] h-[400px] w-full  p-4">
              <div className="md:flex md:mb-2 mb-8   w-full justify-between items-center">
               <h2 className="text-lg font-semibold mb-2">{aiView} AI Goal Activity</h2>
          <div className="relative flex bg-gray-100 p-1 md:w-3/12 w-11/12 rounded-md md:overflow-hidden">
                    {/* Sliding Background */}
                    <div
                      className={`absolute top-1 bottom-1 mx-1   md:w-20 w-20 bg-[#4F378A] shadow-sm shadow-[#4F378A] shadow-opacity-50 rounded-sm transition-all duration-300 ease-in-out`}
                      style={{
                        left: `${["weekly", "monthly", "yearly"].indexOf(aiView) * 33.3}%`,
                      }}
                    />

                    {/* Buttons */}
                    {["weekly", "monthly", "yearly"].map((v, i) => (
                      <button
                        key={v}
                        onClick={() => setAiView(v)}
                        className={`
                          relative z-10 w-1/3 px-4 py-1 md:text-sm text-xs text-center transition-colors duration-200
                          ${aiView === v ? "text-white" : "text-gray-800"}
                        `}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>

             </div>
             <ResponsiveContainer  height="100%" style={{width: isSm ? "100%": "100%" }} >
              <LineChart data={chartAiData} style={{right:isSm ? "18px" : "8px",  height: isSm ? "80%" : "100%", }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>

            </CardContent>
          </Card>
          )}



          {/* Chart */}


          {chartData.length > 0 && (
             <Card className="mt-6">
            <CardContent className="md:h-[300px] h-[400px] p-4">
             <div className="md:flex md:mb-2 mb-8  w-full justify-between items-center">
               <h2 className="text-lg font-semibold mb-2">{view} Goal Activity</h2>
          <div className="relative flex bg-gray-100 p-1 md:w-3/12 w-11/12 rounded-md overflow-hidden">
                    {/* Sliding Background */}
                    <div
                      className={`absolute top-1 bottom-1 mx-1  w-20 bg-[#4F378A] shadow-sm shadow-[#4F378A] shadow-opacity-50 rounded-sm transition-all duration-300 ease-in-out`}
                      style={{
                        left: `${["weekly", "monthly", "yearly"].indexOf(view) * 33.3}%`,
                      }}
                    />

                    {/* Buttons */}
                    {["weekly", "monthly", "yearly"].map((v, i) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`
                          relative z-10 w-1/3 px-4 py-1 text-sm text-center transition-colors duration-200
                          ${view === v ? "text-white" : "text-gray-800"}
                        `}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>

             </div>
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} style={{right:isSm ? "18px" : "8px",  height: isSm ? "80%" : "100%" }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>

            </CardContent>
          </Card>
          )}
       

          {/* AI Goals Stats */}
        </>
      )}
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
