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
import { Box,  IconButton, Typography, useTheme, Divider } from "@mui/material";
import { tokens } from "../../../theme";
import Button from "../../components/Button";
import { useSidebar } from '../../../context/SidebarContext';



export default function DailyTemplatesPage() {
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar();
  const [suggestedTemplates, setSuggestedTemplates] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
 
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState("");
  const [newDescription, setNewDescription] = useState("");
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
    // Only require the name field
    if (!newTemplate.trim()) {
        alert("Template name cannot be empty."); // Optional user feedback
        return;
    }

    
    const template_data = { 
        name: newTemplate.trim(),
        description: newDescription.trim() // Send the description
    };

    // 2. Call the API
    const template = await createDailyTemplates(template_data);
    
    // 3. Update local state and clear inputs
    setTemplates([...templates, template]);
    setNewTemplate("");
    setNewDescription(""); // <-- CLEAR THE NEW DESCRIPTION STATE
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
    <div className="py-6 px-4    mx-auto">
      <div className="mb-[30px]  w-full justify-between flex">
                              <Typography 
                              variant="h2" 
                              color={colors.text.primary} 
                              fontWeight="bold" 
                              
                              >My Templates</Typography>
                              <div >
                                <Button onClick={openModal}  className=' flex items-center' text="Create Template">
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
                                        className=""
                                          style={{ stroke: '#FFFFFF' }} // Inline style to ensure white stroke
                                        >
                                          <line x1="12" y1="5" x2="12" y2="19" />
                                          <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                     
                        </Button>


                              </div>

                 


      
                        </div>

      <Backdrop
          sx={(theme) => ({  zIndex: theme.zIndex.drawer + 1 })}
          open={open}// Use open state for backdrop
          onClick={handleClose} // Clicking outside should close it
        >
           <div 
            className=" md:w-4/12 w-11/12 rounded-lg shadow-lg text-center" style={{ backgroundColor: colors.menu.primary }} 
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
             {/* Add new template */}
      <div className="flex  flex-col  mb-2">
         <div className='flex px-6 mt-4  w-full  justify-end'>
                    <div className='flex  w-full items-center justify-between'>
                    <h1 className='text-xl font-semibold  flex items-center justify-center gap-2' style={{ color: colors.text.secondary }}>
                      New Template
                    </h1>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={colors.text.primary}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="cursor-pointer"
                      onClick={handleClose}
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>  
                    
        
        
        
                    </div>
        
                    </div>
                    <div className='mt-4'>
                                      <Divider orientation="horizontal" sx={{ borderColor: "#00000", opacity: 0.8 }} />
                                    </div>
                    
        <div  className="flex px-6  mt-4 flex-col w-full   gap-4">
            <p className='text-sm text-start  ' style={{color:colors.text.primary}}>Title</p>
        <input
          value={newTemplate}
          onChange={(e) => setNewTemplate(e.target.value)}
          placeholder="New template name..."
          className="flex-1 border rounded px-2 py-1"
        />
        </div>

         <div className="flex p-6  flex-col w-full   gap-4">
        <p className='text-sm text-start  ' style={{color:colors.text.primary}}>Description</p>
     


        <input 
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder="Template description (optional)..."
        className="flex-1 border rounded px-2 py-1 mb-2" // Added mb-2 for spacing
      />
      </div>
       <div className="w-full mb-8  px-6">
         <button
          onClick={() => {
        // Prevent modal background handler from firing
        addTemplate();       // Execute the template creation
        handleClose();
    }}
          className="mt-8 w-full py-2 text-white rounded-lg cursor-pointer hover:opacity-70"
  style={{ backgroundColor: colors.primary[500] }}
        >
          Add Template
        </button>
       </div>
      </div>



          </div>
        

      </Backdrop>

     
      {/* Templates list */}
      <ul
  className={`grid gap-4 md:space-y-2 space-y-6 w-full ${
    !isMobile
      ? isCollapsed
        ? "md:grid-cols-4"
        : "md:grid-cols-3"
      : "grid-cols-1"
  }`}
>

        {templates.map((t) => (
          <li
            key={t.id}
            className="flex  w-full justify-between items-center "
          >
           <div
           
            className="p-5 rounded-4xl  w-full h-full shadow-md flex flex-col justify-between"
            style={{ backgroundColor: colors.background.sidebar, color: colors.primary[100] }}
          >
            <div className="py-4">
            <h3 className="text-lg font-semibold">{t.name}</h3>
           <p className="text-xs mt-2 opacity-90">{t.description || "No description"}</p>

          </div>

            <button
   onClick={() => navigate(`/dashboard/templates/${t.id}`)}
  className="rounded-4xl mb-2 mt-4 p-2 border transition-all duration-300 cursor-pointer"
  style={{
    borderColor: "#D6CFFF",
    color: "#D6CFFF",
  }}
  onMouseEnter={(e) => {
    e.target.style.color = colors.background.paper;
    e.target.style.boxShadow = "0 0 12px #D6CFFF";
  }}
  onMouseLeave={(e) => {
    e.target.style.color = "#D6CFFF";
    e.target.style.boxShadow = "none";
  }}
  onMouseDown={(e) => {
    e.target.style.boxShadow = "0 0 20px #D6CFFF";
    e.target.style.transform = "scale(0.98)";
  }}
  onMouseUp={(e) => {
    e.target.style.boxShadow = "0 0 12px #D6CFFF";
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
  <div className="mt-4">
    <Typography variant="h4" color={colors.text.placeholder} fontWeight="light">
      Suggested Templates
    </Typography>
    <div
  className={`grid gap-4 mt-4 ${
    !isMobile
      ? isCollapsed
        ? "md:grid-cols-4"
        : "md:grid-cols-3"
      : "grid-cols-1"
  }`}
>

      {suggestedTemplates.map((s, index) => (
        <div
          key={index}
         
          className="p-5 rounded-4xl  shadow-md flex flex-col justify-between"
          style={{ backgroundColor: colors.background.sidebar,  color: colors.primary[100] }}
        >
          <div className="py-4">
            <h3 className="text-lg font-semibold">{s.name}</h3>
            <p className="text-xs mt-2 opacity-90">{s.description || "No description"}</p>
          </div>
          <button
  onClick={() =>
  navigate(`/dashboard/templates/suggested/${encodeURIComponent(s.name)}`, {
    state: { isSuggested: true, template: s },
  })
}


  className="rounded-4xl mb-2 mt-4 p-2 border transition-all duration-300 cursor-pointer"
    style={{
    borderColor: "#D6CFFF",
    color: "#D6CFFF",
  }}
  onMouseEnter={(e) => {
    e.target.style.color = colors.background.paper;
    e.target.style.boxShadow = "0 0 12px #D6CFFF";
  }}
  onMouseLeave={(e) => {
    e.target.style.color = "#D6CFFF";
    e.target.style.boxShadow = "none";
  }}
  onMouseDown={(e) => {
    e.target.style.boxShadow = "0 0 20px #D6CFFF";
    e.target.style.transform = "scale(0.98)";
  }}
  onMouseUp={(e) => {
    e.target.style.boxShadow = "0 0 12px #D6CFFF";
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
