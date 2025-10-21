import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import {
  fetchDailyTemplates,
  fetchDailyActivities,
  createDailyActivities,
  updateActivitiesById,
  deleteActivitiesById,
  markDailyActivityComplete,
  deleteTemplatesById,
  saveTemplateSuggestion
} from "../../../utils/Api"; 
import Modal from '@mui/material/Modal';
import ActivityForm from "./ActivityForm";
import { useTheme, Backdrop, Box, Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { tokens } from "../../../theme";
import { FaRegTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";


export default function DailyTemplateDetail() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 move this up before using it
  const { templateId, templateName } = useParams();
  const menuRef = useRef(null);
  const { isSuggested, template: suggestedTemplate } = location.state || {};
  const [template, setTemplate] = useState(suggestedTemplate || null);
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openAddSnackbar, setOpenAddSnackbar] = useState(false);
  const [openCompleteSnackbar, setOpenCompleteSnackbar] = useState(false);
    

  
  


  useEffect(() => {
  if (isSuggested && suggestedTemplate) {
    // If it's a suggested template, use data from location.state
    setTemplate(suggestedTemplate);
    setActivities(suggestedTemplate.activities || []);
  } else if (templateId) {
    // If it's a saved template, fetch it by ID
    const loadTemplate = async () => {
      const data = await fetchDailyTemplates();
      const found = data.find((t) => t.id === parseInt(templateId));

      if (found) {
        const today = new Date().toISOString().split("T")[0];
        setTemplate(found);
        setActivities((found.activities || []).filter(a => a.date === today));
      }
    };
    loadTemplate();
  }
}, [templateId, isSuggested, suggestedTemplate]);


  useEffect(() => {
  if (template && !isSuggested) {
    loadActivities();
  }
}, [template, isSuggested]);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const loadActivities = async () => {
    const data = await fetchDailyActivities();
    setActivities(data.filter((a) => a.template === template.id));
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const addActivity = async (activityData) => {
    const activity = await createDailyActivities({
      template: template.id,
      ...activityData,
    });
    setActivities([...activities, activity]);
    setOpenAddSnackbar(true);
  };

  const toggleActivity = async (activity) => {
  const updated = await markDailyActivityComplete(activity.id, !activity.completed);
  setActivities((prev) =>
    prev.map((a) => (a.id === activity.id ? { ...a, completed: updated.completed } : a))
  );
};

  const deleteActivity = async (id) => {
    await deleteActivitiesById(id);
    setActivities(activities.filter((a) => a.id !== id));
  };

 const handleDeleteTemplate = async (templateId) => {
  try {
    await deleteTemplatesById(templateId);
    setDeleteOpen(false);  // close modal
    navigate("/dashboard/templates");  // go back to list page
  } catch (error) {
    console.error("Failed to delete template:", error);
  }
};

const handleSaveSuggestedTemplate = async (templateData) => {
  try {
    const savedTemplate = await saveTemplateSuggestion({
      name: templateData.name,
      description: templateData.description,
      activities: templateData.activities,
    });
    navigate(`/dashboard/templates/${savedTemplate.id}`);
  } catch (error) {
    console.error("Failed to save suggested template:", error);
  }
};


  return (
    <div className=" p-4 ">
      <div className="w-full flex justify-between">
     <div className=" w-full md:mb-8 mb-4  flex justify-between">
         <h2 className="text-xl font-medium space-x-2">
        <span>
          Activities for
        </span>

        <span className="px-2" style={{backgroundColor: colors.background.paper, color: colors.text.secondary}}>
        {template?.title || template?.name}
        </span>
         
      </h2>
        {isSuggested && (
  <button
    onClick={() => handleSaveSuggestedTemplate(template)}
    className="rounded-md gap-2 justify-center items-center flex  px-2 py-1  transition-all duration-300 cursor-pointer"
    style={{
      backgroundColor: colors.primary[500],
      color: colors.background.default,
    }}
    onMouseEnter={(e) => {
      e.target.style.color = colors.background.paper;
      e.target.style.boxShadow = `0 0 12px ${colors.background.default}`;
    }}
    onMouseLeave={(e) => {
      e.target.style.color = colors.background.default;
      e.target.style.boxShadow = "none";
    }}
  >
     <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="#6246AC"
                                          stroke="#FFFFFF"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        className="hidden md:block"
                                          style={{ stroke: '#FFFFFF' }} // Inline style to ensure white stroke
                                        >
                                          <line x1="12" y1="5" x2="12" y2="19" />
                                          <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
    Save Template
  </button>
)}
     </div>
    

      {!isSuggested && (
      <div className="relative"  ref={menuRef}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#65558F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cursor-pointer"
                onClick={toggleMenu}
              >
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
               {menuVisible && (
                  <div className="absolute right-0 mt-2 w-48  rounded-md shadow-lg z-50" style={{ backgroundColor: colors.menu.primary }}>
                    {/* {<button 
                      onClick={() => {
                        setIsRenaming(true);
                        setTimeout(() => inputRef.current?.focus(), 0); // Ensure focus on input
                      }} 
                      className="block w-full text-left px-4 py-2 text-xs  hover:bg-[#D6CFFF]/20" style={{ color: colors.text.primary }}
                    >
                      Rename goal
                    </button>} */}
                    <Button
                   
                      size="small"
                      sx={{
                        ml: 1,
                        
                        color: colors.primary[500],
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: colors.primary[500],
                          color: colors.background.default,
                        },
                      }}
                      onClick={() => navigate(`/dashboard/templates/${templateId}/history`)}
                    >
                      View History
                    </Button>

                    <button onClick={() => setDeleteOpen(true)} className='block w-full text-left px-4 py-2 text-xs  hover:bg-[#D6CFFF]/20' style={{ color: colors.background.warning }}>
                      Delete
                    </button>
                  

                   
                  </div>
                )}
              </div>
                )}
      </div>
    
    

       {/* Add Activity Button (mobile) */}
      <div className="w-full flex p-2 justify-end">
        <button
        onClick={() => setShowForm(true)}
        className="md:hidden text-white px-3 py-1 rounded"
        style={{ backgroundColor: colors.primary[500] }}
      >
        + Add Activity
      </button>
      </div>

       <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                        <Box className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6  rounded-xl w-96' sx={{backgroundColor: colors.menu.primary}}>
                          <h2 className="text-xl font-semibold mb-4">Delete Template</h2>
                          <p>Are you sure you want to delete this template?</p>

                          <div className="flex justify-end gap-4 mt-4">
                            <Button onClick={() => setDeleteOpen(false)} variant="outlined">Cancel</Button>
                            <Button onClick={() => handleDeleteTemplate(templateId)} variant="contained" sx={{backgroundColor: colors.background.warning}}>
                                Delete
                          </Button>

                          </div>
                        </Box>
                      </Modal>

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
              onChange={() => {
              toggleActivity(activity);
              setOpenCompleteSnackbar(true);
            }}
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

         <Snackbar
          open={openAddSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenAddSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={() => setOpenAddSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            Activity successfully added!
          </MuiAlert>
        </Snackbar>

        <Snackbar
        open={openCompleteSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenCompleteSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setOpenCompleteSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Activity successfully completed!
        </MuiAlert>
      </Snackbar>



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
          className=" w-full flex justify-center items-center"
         
          
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
