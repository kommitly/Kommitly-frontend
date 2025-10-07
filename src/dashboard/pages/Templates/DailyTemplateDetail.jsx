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
import { motion } from "framer-motion";


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
      <h2 className="text-xl font-medium md:mb-8 mb-4 space-x-2">
        <span>
          Activities for
        </span>

        <span className="px-2" style={{backgroundColor: colors.background.paper, color: colors.text.secondary}}>
        {template?.title || template?.name}
        </span>
         
      </h2>
       {/* Add Activity Button (mobile) */}
      <div className="w-full flex justify-end">
        <button
        onClick={() => setShowForm(true)}
        className="md:hidden text-white px-3 py-1 rounded"
        style={{ backgroundColor: colors.primary[500] }}
      >
        + Add Activity
      </button>
      </div>

      <div className="grid grid-cols-12 gap-8">



        {/* Activity List */}
        <div className="space-y-4 md:mt-0 mt-4 h-screen max-h-10/12 overflow-y-auto no-scrollbar mb-4 md:p-0 p-4 md:col-span-7 col-span-12">
          {activities
  ?.slice()
  .sort((a, b) => a.start_time.localeCompare(b.start_time))
  .map((activity, index) => {
    const isLast = index === activities.length - 1;
    const isCompleted = activity.completed;
    const isActive = !isCompleted && index === activities.findIndex(a => !a.completed);
    const lineY2 = 130; // controls line length

    return (
      <div key={activity.id} className="relative flex items-center">
        {/* Activity item */}
        <div
          className="flex items-center justify-between p-2 w-11/12 md:ml-18 ml-8 rounded-xl"
          style={{ backgroundColor: colors.background.paper }}
        >
          <label className="flex items-center space-x-2 p-2">
            <input
              type="checkbox"
              checked={activity.completed}
              onChange={() => toggleActivity(activity)}
            />
            <div className="ml-2">
              <p className={activity.completed ? "line-through text-gray-400" : ""}>
                {activity.title}
              </p>
              <span className="text-xs" style={{ color: colors.text.placeholder }}>
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

        {/* SVG Timeline indicator (same style as AI goal page) */}
        <div className="absolute mt-8  md:-left-6 -left-12 top-1/2 transform -translate-y-1/2 flex flex-col items-center overflow-y-auto">
          <motion.svg width="100" height="150" viewBox="0 0 100 150">
            <motion.circle
              cx="50"
              cy="50"
              r="8"
              fill="#4F378A"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.5, duration: 0.6, ease: "easeOut" }}
            />

            {/* Animated dashed line to next activity */}
            {!isLast && (
              <motion.line
                x1="50"
                y1="58"
                x2="50"
                y2={lineY2}
                stroke="#4F378A"
                strokeWidth="2"
                strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            )}

            {/* Completion checkmark */}
            {isCompleted && (
              <motion.g
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                  >
                                                    <path
                                                      d="M47 50 L49 52 L53 47"
                                                      stroke="white"
                                                      strokeWidth="1.5"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    />
                                                  </motion.g>
            )}

            {/* Active ring */}
            {isActive && (
             <motion.g
                                                   initial={{ opacity: 0, scale: 0 }}
                                                   animate={{ opacity: 1, scale: 1 }}
                                                   transition={{ duration: 0.3, ease: "easeOut" }}
                                                 >
                                                   <circle
                                                     cx="50"
                                                     cy="50"
                                                     r="6"
                                                     stroke="white"
                                                     strokeWidth="2"
                                                     strokeLinecap="round"
                                                     strokeLinejoin="round"
                                                   />
                                                 </motion.g>
            )}
          </motion.svg>
        </div>
      </div>
    );
  })}

        </div>

        {/* Desktop inline info */}
        <div className="hidden  md:block col-span-5">
          
            <ActivityForm
              onSave={(data) => {
                addActivity(data);
              }}
              onCancel={() => {}}
            />
          
        </div>
      </div>

     

      {/* Backdrop for Mobile Form */}
      <Backdrop
        sx={{ color: "#fff", zIndex: theme.zIndex.drawer + 1 }}
        open={showForm}
        onClick={() => setShowForm(false)}
      >
        <div
          className="w-11/12 md:w-5/12  rounded-xl"
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
