import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDailyActivities } from "../../../utils/Api";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

export default function DailyActivityHistory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { templateId } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchDailyActivities("history");

      // Group activities by date
      const filtered = data.filter(a => a.template === parseInt(templateId));
      const grouped = filtered.reduce((acc, act) => {

        const date = new Date(act.date).toLocaleDateString();

        if (!acc[date]) acc[date] = [];
        acc[date].push(act);
        return acc;
      }, {});
      setHistory(grouped);
    };
    loadHistory();
  }, [templateId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Progress History</h2>

      {Object.keys(history).length === 0 && (
        <p style={{ color: colors.text.placeholder }}>No activity history yet.</p>
      )}

      {Object.entries(history).map(([date, activities]) => (
        <div key={date} className="mb-6">
          <h3 className="font-medium mb-2" style={{ color: colors.primary[500] }}>
            {date}
          </h3>
          <div className="space-y-1">
            {activities.map(a => (
              <div
                key={a.id}
                className="p-2 rounded-md flex justify-between items-center"
                style={{
                  backgroundColor: colors.background.paper,
                  opacity: a.completed ? 1 : 0.6,
                }}
              >
                <span>{a.title}</span>
                <span
                  className={`text-sm ${
                    a.completed ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {a.completed ? "✔ Done" : "⏳ Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
