import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";

const ReusableFormModal = ({
  open,
  onClose,
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  colors,
  children,   
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl md:w-96 w-88"
        sx={{ backgroundColor: colors?.menu?.primary || "#fff" }}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {fields.map((field) =>
          field.type === "select" ? (
            <TextField
              key={field.name}
              select
              fullWidth
              label={field.label}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={onChange}
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
              key={field.name}
              fullWidth
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              value={formData[field.name] || ""}
              onChange={onChange}
              margin="normal"
              InputLabelProps={
              (field.type === "date" || field.type === "time") ? { shrink: true } : {}
            }
            />
          )
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
