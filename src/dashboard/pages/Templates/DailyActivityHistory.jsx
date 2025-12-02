import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchDailyActivities } from "../../../utils/Api";
import { useTheme, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import Empty from "../../components/Empty";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import dayjs from "dayjs";


export default function DailyActivityHistory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { templateId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  // NEW STATE: Tracks the activities for the day clicked on the heatmap
  const [selectedDayActivities, setSelectedDayActivities] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      const data = await fetchDailyActivities("history");

      // Group activities by date (YYYY-MM-DD)
      const filtered = data.filter(a => a.template === parseInt(templateId));
      const grouped = filtered.reduce((acc, act) => {
        const date = dayjs(act.date).format('YYYY-MM-DD');

        if (!acc[date]) acc[date] = [];
        acc[date].push(act);
        return acc;
      }, {});
      setHistory(grouped);
      setLoading(false);
    };
    loadHistory();
  }, [templateId]);

  // --- Heatmap Data Transformation ---
  const heatmapData = useMemo(() => {
    if (Object.keys(history).length === 0) return [];

    const data = [];

    for (const [dateStr, activities] of Object.entries(history)) {
      const totalActivities = activities.length;
      const completedActivities = activities.filter(a => a.completed).length;

      let count = 0; // Scale 0-4
      if (totalActivities > 0) {
        const completionRate = completedActivities / totalActivities;
        // The color scale is correctly based on completionRate (activities marked as done)
        if (completionRate > 0) count = 1;
        if (completionRate >= 0.33) count = 2;
        if (completionRate >= 0.66) count = 3;
        if (completionRate === 1.0) count = 4;
      }
      data.push({ date: dateStr, count });
    }

    return data;
  }, [history]);
  // ------------------------------------------------

  // Function to set the color based on the 'count' (completion rate)
  const classForValue = (value) => {
    if (!value) {
      return 'color-empty';
    }
    return `color-scale-${value.count}`;
  };

  // NEW FUNCTION: Handles the click event on a heatmap cell
  const handleCellClick = (value) => {
    if (value && value.date) {
      // Use YYYY-MM-DD to look up activities in the history object
      const dateKey = dayjs(value.date).format('YYYY-MM-DD');
      const activities = history[dateKey] || [];
      setSelectedDayActivities({
        date: value.date,
        activities: activities,
      });
    } else {
      setSelectedDayActivities(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>; // Simple loading state
  }

  return (
    <div className="p-4">
     
        <Typography 
                              variant="h5" 
                              color={colors.text.primary} 
                              fontWeight="semibold" 
                              marginBottom={4}
                              
                              >   Activity Completion Heatmap</Typography>

      {Object.keys(history).length === 0 ? (
        <div className="h-[40vh] flex justify-center items-center">
          <Empty />
        </div>
      ) : (
        <div >

          <CalendarHeatmap
            startDate={dayjs().subtract(1, 'year').toDate()} // Show last 1 year
            endDate={dayjs().toDate()}
            values={heatmapData}
            classForValue={classForValue}
            // Add click handler to select the day
            onClick={handleCellClick}
            // Tooltip to show details on hover
            tooltipDataAttrs={value => {
              if (value && value.date) {
                const dayActivities = history[dayjs(value.date).format('YYYY-MM-DD')] || [];
                const completed = dayActivities.filter(a => a.completed).length;
                const total = dayActivities.length;
                return {
                  'data-tip': `${dayjs(value.date).format('MMM D, YYYY')}: ${completed} of ${total} completed (${value.count}/4 intensity)`,
                };
              }
              return { 'data-tip': 'No activities recorded' };
            }}
            showMonthLabels={true}
            showWeekdayLabels={true}
            horizontal={true} // FIX: Set to true for horizontal display (Jan to Dec)
            gutter={3}
          />

          <div className="flex justify-end items-center mt-4 text-sm" style={{ color: colors.text.secondary }}>
            <span className="mr-2">Less Completion</span>
            <div className="w-4 h-4 rounded mx-1" style={{ backgroundColor: colors.primary[100] }}></div>
            <div className="w-4 h-4 rounded mx-1" style={{ backgroundColor: colors.primary[300] }}></div>
            <div className="w-4 h-4 rounded mx-1" style={{ backgroundColor: colors.primary[400] }}></div>
            <div className="w-4 h-4 rounded ml-1" style={{ backgroundColor: colors.primary[500] }}></div>
            <span className="ml-2">More Completion</span>
          </div>

        </div>
      )}

      {/* NEW SECTION: Display activities for the selected day */}
      {selectedDayActivities && (
        <div  className=" md:w-7/12 w-full  ">
          <div className="flex mt-6 justify-between items-center mb-4">
            <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
              Activities for {dayjs(selectedDayActivities.date).format('MMMM D, YYYY')}
            </h3>
            <button
              onClick={() => setSelectedDayActivities(null)}
              className="text-xl font-semibold"
              style={{ color: colors.text.secondary }}
            >
              &times;
            </button>
          </div>

          {selectedDayActivities.activities.length > 0 ? (
            <ul className="list-none  w-full  p-0 m-0">
              {selectedDayActivities.activities.map((act) => (
                <li key={act.id} className="flex justify-between items-center rounded-lg m-2 p-2"  style={{ backgroundColor: colors.background.paper }}>
                  <span className="text-base" style={{ color: colors.text.primary }}>
                    {act.activity_title}
                  </span>
                 <span
                 className="p-2 rounded-md"
  style={
    act.completed
      ? {color: "#0D81E0" ,
          backgroundColor: "rgba(13, 129, 224, 0.1)", // 20% opacity background
          }
      : {
          color: colors.background.warning,
          backgroundColor: "rgba(230, 1, 120, 0.1)", // 20% opacity background
        }
  }
>
  <span>{act.completed ? "✓ Done" : " Pending"}</span>
</span>

                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base" style={{ color: colors.text.secondary }}>
              No activities recorded for this day.
            </p>
          )}
        </div>
      )}
      
   
  
    </div>
  );
}