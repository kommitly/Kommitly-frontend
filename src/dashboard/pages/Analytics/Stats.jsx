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
import { BarChart } from '@mui/x-charts/BarChart';
import { animated, useSpring } from '@react-spring/web';

function getCompletionTrends(goals = [], view) {
  const now = dayjs();
  let range = 7;
  let format = "ddd";

  if (view === "monthly") {
    range = 30;
    format = "MMM D";
  } else if (view === "yearly") {
    range = 12;
    format = "MMM";
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

    const index = trend.findIndex((item) => item.name === label);
    if (index !== -1) trend[index].value += 1;
  };

  goals.forEach((goal) => {
    goal.tasks?.forEach((task) => {
      incrementDayCount(task.completed_at);
      task.subtasks?.forEach((subtask) =>
        incrementDayCount(subtask.completed_at)
      );
    });
  });

  return trend;
}

export default function Stats() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState("weekly");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [key, animate] = React.useReducer((v) => v + 1, 0);
  const [goalTypeFilter, setGoalTypeFilter] = useState("all");

  useEffect(() => {
    const getGoals = async () => {
      try {
        const response = await fetchGoals();
        const userGoals = response.goals || [];
        const aiGoals = response.ai_goals || [];

        setGoals([...userGoals, ...aiGoals]);

        let filteredGoals = [];

        if (goalTypeFilter === "all") {
          filteredGoals = [...userGoals, ...aiGoals];
        } else if (goalTypeFilter === "ai") {
          filteredGoals = [...aiGoals];
        } else if (goalTypeFilter === "user") {
          filteredGoals = [...userGoals];
        }

        // 🔥🔥 DEBUG LOGGING — SEE EVERYTHING 🔥🔥
        console.log("====== RAW API DATA ======");
        console.log("User Goals:", userGoals);
        console.log("AI Goals:", aiGoals);

        console.log("====== FILTER SELECTION ======");
        console.log("goalTypeFilter:", goalTypeFilter);

        console.log("====== FILTERED GOALS ======");
        console.log(filteredGoals);

        filteredGoals.forEach((goal, i) => {
          console.log(`--- Goal ${i + 1}:`, goal.title || goal.name);
          goal.tasks?.forEach((t, j) => {
            console.log(`Task ${j + 1}:`, {
              title: t.title,
              completed_at: t.completed_at,
            });

            t.subtasks?.forEach((s, k) => {
              console.log(`   Subtask ${k + 1}:`, {
                title: s.title,
                completed_at: s.completed_at,
              });
            });
          });
        });

        const result = getCompletionTrends(filteredGoals, view);

        console.log("====== CHART RESULT ======");
        console.log(result);

        setChartData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getGoals();
  }, [view, goalTypeFilter]);

  if (loading) {
    return (
      <>
        <Loading />
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
    <div className="p-6 space-y-6">
      <div className="w-full md:flex gap-4 h-full">
        {chartData.length > 0 && (
          <Card className="mt-6 w-full h-full mb-8">
            <CardContent className="h-auto py-4">
              <div className="flex justify-between items-center w-full mb-2">
                <h2 className="text-lg font-semibold">Goal Activity</h2>

                <select
                  value={goalTypeFilter}
                  onChange={(e) => setGoalTypeFilter(e.target.value)}
                  className="border px-3 py-1 rounded-md bg-transparent"
                >
                  <option value="all">All Goals</option>
                  <option value="ai">AI Goals</option>
                  <option value="user">User Goals</option>
                </select>

                <SlidingButton
                  options={["weekly", "monthly", "yearly"]}
                  selected={view}
                  onChange={setView}
                />
              </div>

              <BarChart
                key={key}
                dataset={chartData}
                xAxis={[{ scaleType: "band", dataKey: "name" }]}
                series={[{ dataKey: "value", label: "Value" }]}
                colors={[colors.primary[500]]}
                width={isSm ? 350 : 420}
                height={400}
                margin={{ left: isSm ? 28 : 30 }}
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
