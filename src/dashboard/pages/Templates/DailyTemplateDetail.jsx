import React, { useEffect, useState } from "react";
import {
  fetchDailyActivities,
  createDailyActivities,
  updateActivitiesById,
  deleteActivitiesById,
} from "../../../utils/Api"; // adjust path
import ActivityForm from "./ActivityForm";

export default function DailyTemplateDetail({ template }) {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [template]);

  const loadActivities = async () => {
    const data = await fetchDailyActivities();
    setActivities(data.filter((a) => a.template === template.id));
  };

  const addActivity = async (activityData) => {
    const activity = await createDailyActivities({
      template: template.id,
      ...activityData,
    });
    setActivities([...activities, activity]);
  };

  const toggleActivity = async (activity) => {
    const updated = await updateActivitiesById(activity.id, {
      completed: !activity.completed,
    });
    setActivities(
      activities.map((a) => (a.id === activity.id ? updated : a))
    );
  };

  const deleteActivity = async (id) => {
    await deleteActivitiesById(id);
    setActivities(activities.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Activities for: {template.title}
      </h2>

    {/* Activity List */}
<div className="space-y-2 mb-4">
  {activities.map((a) => (
    <div
      key={a.id}
      className="flex items-center justify-between p-2 border rounded"
    >
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={a.completed}
          onChange={() => toggleActivity(a)}
        />
        <span
          className={a.completed ? "line-through text-gray-400" : ""}
        >
          {a.title}{" "}
          <span className="text-sm text-gray-500">
            ({a.start_time} - {a.end_time})
          </span>
        </span>
      </label>
      {!a.is_fixed && (
        <button
          onClick={() => deleteActivity(a.id)}
          className="text-red-500 hover:underline"
        >
          Delete
        </button>
      )}
    </div>
  ))}
</div>


      {/* Add Activity */}
      {showForm ? (
        <ActivityForm
          onSave={(data) => {
            addActivity(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Add Activity
        </button>
      )}
    </div>
  );
}
