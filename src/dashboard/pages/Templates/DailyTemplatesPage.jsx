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
import ReusableFormModal from '../../components/ReusableFormModal';


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
  const [formData, setFormData] = useState({
     
       title: "",
       description: "",
     
     });
   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


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

  if (!formData.title.trim()) {
    alert("Template name cannot be empty.");
    return;
  }

  const template_data = {
    name: formData.title.trim(),
    description: formData.description.trim(),
  };

  const template = await createDailyTemplates(template_data);

  setTemplates([...templates, template]);

  // reset form
  setFormData({
    title: "",
    description: "",
  });
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

     

        <ReusableFormModal
  open={open}
  onClose={handleClose}
  title="New Template"
  colors={colors}
  formData={formData}
  onChange={handleChange}
  onSubmit={() => {
    addTemplate();
    handleClose();
  }}
  fields={[
    { name: "title", label: "Title" },
    { name: "description", label: "Description" },
  ]}
/>




     
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
