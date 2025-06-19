import { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { fetchGoals } from '../../../utils/Api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FaChartBar, FaUser, FaTasks, FaCheck } from "react-icons/fa";
import dayjs from "dayjs";

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
      <h1 className="text-2xl font-bold">📊 Dashboard Overview</h1>

      {loading ? (
        <p>Loading stats...</p>
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
            <CardContent className="h-[300px] p-4">
              <div className="flex w-full justify-between items-center">
               <h2 className="text-lg font-semibold mb-2">{aiView} AI Goal Activity</h2>
          <div className="relative flex bg-gray-100 p-1 w-3/12 rounded-md overflow-hidden">
                    {/* Sliding Background */}
                    <div
                      className={`absolute top-1 bottom-1 mx-1  w-20 bg-[#4F378A] shadow-sm shadow-[#4F378A] shadow-opacity-50 rounded-sm transition-all duration-300 ease-in-out`}
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
                          relative z-10 w-1/3 px-4 py-1 text-sm text-center transition-colors duration-200
                          ${aiView === v ? "text-white" : "text-gray-800"}
                        `}
                      >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>

             </div>
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartAiData}>
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
            <CardContent className="h-[300px] p-4">
             <div className="flex w-full justify-between items-center">
               <h2 className="text-lg font-semibold mb-2">{view} Goal Activity</h2>
          <div className="relative flex bg-gray-100 p-1 w-3/12 rounded-md overflow-hidden">
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
              <LineChart data={chartData}>
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
        <div className="text-purple-600 text-xl">{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
