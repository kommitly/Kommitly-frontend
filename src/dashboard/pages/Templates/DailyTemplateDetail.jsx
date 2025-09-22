import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  fetchDailyTemplates,
  fetchDailyActivities,
  createDailyActivities,
  updateActivitiesById,
  deleteActivitiesById,
} from "../../../utils/Api"; 
import ActivityForm from "./ActivityForm";
import { useTheme, Backdrop } from "@mui/material";
import { tokens } from "../../../theme";
import { FaRegTrashAlt } from "react-icons/fa";

export default function DailyTemplateDetail() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadTemplate = async () => {
      const data = await fetchDailyTemplates();
      const found = data.find((t) => t.id === parseInt(templateId));
      setTemplate(found);
    };
    loadTemplate();
  }, [templateId]);

  useEffect(() => {
    if (template) loadActivities();
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
    <div className=" p-4 ">
      <h2 className="text-xl font-bold mb-4">
        Activities for: {template?.title || template?.name}
      </h2>

      <div className="grid grid-cols-12 gap-4">
        {/* Activity List */}
        <div className="space-y-2 mb-4 md:col-span-6 col-span-12">
          {activities
            ?.slice()
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
            .map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-2 rounded-xl"
                style={{ backgroundColor: colors.background.paper }}
              >
                <label className="flex items-center space-x-2 p-2">
                  <input
                    type="checkbox"
                    checked={activity.completed}
                    onChange={() => toggleActivity(activity)}
                  />
                  <div className="ml-2">
                    <p
                      className={
                        activity.completed ? "line-through text-gray-400" : ""
                      }
                    >
                      {activity.title}
                    </p>
                    <span
                      className="text-xs"
                      style={{ color: colors.text.placeholder }}
                    >
                      ({activity.start_time} - {activity.end_time})
                    </span>
                  </div>
                </label>
                {!activity.is_fixed && (
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="text-red-500 mr-4"
                  >
                    <FaRegTrashAlt />
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* Desktop inline info */}
        <div className="hidden md:block col-span-6">
          
            <ActivityForm
              onSave={(data) => {
                addActivity(data);
              }}
              onCancel={() => {}}
            />
          
        </div>
      </div>

      {/* Add Activity Button (mobile) */}
      <button
        onClick={() => setShowForm(true)}
        className="md:hidden text-white px-3 py-1 rounded"
        style={{ backgroundColor: colors.primary[500] }}
      >
        + Add Activity
      </button>

      {/* Backdrop for Mobile Form */}
      <Backdrop
        sx={{ color: "#fff", zIndex: theme.zIndex.drawer + 1 }}
        open={showForm}
        onClick={() => setShowForm(false)}
      >
        <div
          className="w-11/12 md:w-1/2  rounded-xl"
           style={{backgroundColor: colors.menu.primary}}
          
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
        >
          <ActivityForm
            onSave={(data) => {
              addActivity(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </Backdrop>
    </div>
  );
}
