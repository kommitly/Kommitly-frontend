import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchDailyTemplates,
  createDailyTemplates,
  deleteTemplatesById,
  fetchTemplatesSuggestions,
  saveTemplateSuggestion

} from "../../../utils/Api"; // adjust path
import DailyTemplateDetail from "./DailyTemplateDetail";
import Backdrop from '@mui/material/Backdrop';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

export default function DailyTemplatesPage() {
  const [suggestedTemplates, setSuggestedTemplates] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
 
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState("");
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
    loadSuggestions();
  }, []);

  const loadTemplates = async () => {
    const data = await fetchDailyTemplates();
    setTemplates(data);
  };


const loadSuggestions = async () => {
  setLoadingSuggestions(true);
  try {
    const data = await fetchTemplatesSuggestions();
    setSuggestedTemplates(data);
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
  } finally {
    setLoadingSuggestions(false);
  }
};

  const addTemplate = async () => {
    if (!newTemplate.trim()) return;
    const template = await createDailyTemplates({ title: newTemplate });
    setTemplates([...templates, template]);
    setNewTemplate("");
  };

  const deleteTemplate = async (id) => {
    await deleteTemplatesById(id);
    setTemplates(templates.filter((t) => t.id !== id));
    if (selectedTemplate?.id === id) setSelectedTemplate(null);
  };

  const openModal = () => {
    setOpen(true);
  };
    const handleClose = () => {
    setOpen(false);
  };

  const handleSaveSuggestedTemplate = async (suggestion) => {
  try {
    const savedTemplate = await saveTemplateSuggestion({
      name: suggestion.name,
      description: suggestion.description,
      activities: suggestion.activities,
    });

    // Add to templates
    setTemplates((prev) => [...prev, savedTemplate]);

    // Remove it from suggestedTemplates list
    setSuggestedTemplates((prev) =>
      prev.filter((s) => s.name !== suggestion.name)
    );

    // Redirect to detail page
    navigate(`/dashboard/templates/${savedTemplate.id}`);
  } catch (error) {
    console.error("Failed to save suggested template:", error);
  }
};



  return (
    <div className="p-6  mx-auto">
      <div className="mb-[30px]  w-full justify-between flex">
                              <Typography 
                              variant="h2" 
                              color={colors.text.primary} 
                              fontWeight="bold" 
                              
                              >Templates</Typography>
      <Button onClick={openModal}  className=' flex items-center text-sm font-light text-white px-4 gap-2 py-1 cursor-pointer rounded-lg' sx={{backgroundColor:"#4F378A", borderRadius: '6px', paddingX: '12px'}}>
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
                                        <p
                                          
                                          className='md:text-xs text-xs xl:text-sm 2xl:text-xl '
                                          style={{ color: colors.primary[100] }}
                                         
                                        >
                                        Create Template
                                        </p>
                        </Button>
                        </div>

      <Backdrop
          sx={(theme) => ({  zIndex: theme.zIndex.drawer + 1 })}
          open={open}// Use open state for backdrop
          onClick={handleClose} // Clicking outside should close it
        >
           <div 
            className=" md:w-4/12 w-11/12 p-6 rounded-lg shadow-lg text-center" style={{ backgroundColor: colors.menu.primary }} 
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
             {/* Add new template */}
      <div className="flex space-x-2 mb-6">
        <input
          value={newTemplate}
          onChange={(e) => setNewTemplate(e.target.value)}
          placeholder="New template name..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={addTemplate}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>



          </div>
        

      </Backdrop>

     
      {/* Templates list */}
      <ul className="space-y-2 w-full">
        {templates.map((t) => (
          <li
            key={t.id}
            className="flex md:w-1/3 w-full justify-between items-center p-3"
          >
           <div
           
            className="p-5 rounded-xl shadow-md flex flex-col justify-between"
            style={{ backgroundColor: colors.primary[500], color: colors.primary[100] }}
          >
            <div className="py-4">
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="text-sm mt-2 opacity-90">{t.description}</p>
          </div>

            <button
   onClick={() => navigate(`/dashboard/templates/${t.id}`)}
  className="rounded-lg mt-4 p-2 border transition-all duration-300 cursor-pointer"
  style={{
    borderColor: colors.background.paper,
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
  onMouseDown={(e) => {
    e.target.style.boxShadow = `0 0 20px ${colors.background.default}`;
    e.target.style.transform = "scale(0.98)";
  }}
  onMouseUp={(e) => {
    e.target.style.boxShadow = `0 0 12px ${colors.background.default}`;
    e.target.style.transform = "scale(1)";
  }}
>
  View
</button>

          </div>

          {/* {  <button
              onClick={() => deleteTemplate(t.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>} */}
          </li>
        ))}
      </ul>

      {/* Suggested Templates */}
{suggestedTemplates.length > 0 && (
  <div className="mt-10">
    <Typography variant="h4" color={colors.text.placeholder} fontWeight="light">
      Suggested Templates
    </Typography>
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      {suggestedTemplates.map((s, index) => (
        <div
          key={index}
         
          className="p-5 rounded-xl shadow-md flex flex-col justify-between"
          style={{ backgroundColor: colors.primary[500], color: colors.primary[100] }}
        >
          <div className="py-4">
            <h3 className="text-lg font-semibold">{s.name}</h3>
            <p className="text-sm mt-2 opacity-90">{s.description}</p>
          </div>
          <button
  onClick={() =>
  navigate(`/dashboard/templates/suggested/${encodeURIComponent(s.name)}`, {
    state: { isSuggested: true, template: s },
  })
}


  className="rounded-lg mt-4 p-2 border transition-all duration-300 cursor-pointer"
  style={{
    borderColor: colors.background.paper,
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
  onMouseDown={(e) => {
    e.target.style.boxShadow = `0 0 20px ${colors.background.default}`;
    e.target.style.transform = "scale(0.98)";
  }}
  onMouseUp={(e) => {
    e.target.style.boxShadow = `0 0 12px ${colors.background.default}`;
    e.target.style.transform = "scale(1)";
  }}
>
  View
</button>

{/* {<button
  onClick={() => handleSaveSuggestedTemplate(s)}
  className="rounded-lg mt-4 p-2 border transition-all duration-300 cursor-pointer"
  style={{
    borderColor: colors.background.paper,
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
  onMouseDown={(e) => {
    e.target.style.boxShadow = `0 0 20px ${colors.background.default}`;
    e.target.style.transform = "scale(0.98)";
  }}
  onMouseUp={(e) => {
    e.target.style.boxShadow = `0 0 12px ${colors.background.default}`;
    e.target.style.transform = "scale(1)";
  }}
>
  Save
</button>} */}

        </div>
      ))}
    </div>
  </div>
)}


      {/* {
      {selectedTemplate && (
        <div className="mt-8">
          <DailyTemplateDetail template={selectedTemplate} />
        </div>
      )}} */}
    </div>
  );
}
