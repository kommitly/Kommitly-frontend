// ReusableFormModal.jsx

import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'; // Import Add Icon

const ReusableFormModal = ({
  open,
  onClose,
  title,
  fields,
  formData, // This can now be an array or an object
  onChange, // This will be different based on isMultiTask
  onSubmit,
  colors,
  children,
  // **NEW** Props for multi-task
  isMultiTask = false, 
  onAddNewField, 
}) => {

  // Function to render a single input field
  const renderField = (field, value, changeHandler, index) => {
      // Create a unique key for list items, especially when adding new ones
      const key = isMultiTask ? `${field.name}-${index}` : field.name; 

      // Label adjustment for multi-task mode (e.g., Task 1 Title)
      const label = isMultiTask ? `${field.label} ${index + 1}` : field.label;

      return field.type === "select" ? (
        <TextField
          key={key}
          select
          fullWidth
          label={label}
          name={field.name}
          value={value || ""}
          // When in multi-task mode, call onChange with index
          onChange={(e) => isMultiTask ? changeHandler(index, e) : changeHandler(e)}
          margin="normal"
        >
          {field.options?.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          key={key}
          fullWidth
          label={label}
          name={field.name}
          type={field.type || "text"}
          value={value || ""}
          // When in multi-task mode, call onChange with index
          onChange={(e) => isMultiTask ? changeHandler(index, e) : changeHandler(e)}
          margin="normal"
          InputLabelProps={
            (field.type === "date" || field.type === "time") ? { shrink: true } : {}
          }
        />
      );
  };


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl md:w-96 w-88"
        sx={{ backgroundColor: colors?.menu?.primary || "#fff" }}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {/* 1. **MODIFIED** Logic to handle single form object OR array of task objects */}
        {isMultiTask ? (
          // Render multiple sets of fields for each task object in the array
          formData.map((task, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              {fields.map((field) => 
                // Pass the specific task's value and the index to the render function
                renderField(field, task[field.name], onChange, index)
              )}
            </div>
          ))
        ) : (
          // Original single-form logic
          fields.map((field) => 
            renderField(field, formData[field.name], onChange)
          )
        )}
        
        {/* 2. **NEW** "Add Another Task" Button */}
        {isMultiTask && (
          <Button
            onClick={onAddNewField}
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            sx={{ mt: 2, textTransform: "none", color: "#6246AC", borderColor: "#6246AC" }}
          >
            Add Another Task
          </Button>
        )}

        {children}

        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={onClose} variant="outlined" sx={{textTransform: "none"}}
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} variant="contained" color="primary" sx={{textTransform: "none"}}>
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ReusableFormModal;