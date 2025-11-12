import { Modal, Box, TextField, Button } from "@mui/material";

const ReusableFormModal = ({
  open,
  onClose,
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  colors,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl w-96"
        sx={{ backgroundColor: colors?.menu?.primary || "#fff" }}
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {fields.map((field) => (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            value={formData[field.name] || ""}
            onChange={onChange}
            margin="normal"
            InputLabelProps={field.type === "datetime-local" ? { shrink: true } : {}}
          />
        ))}

        <div className="flex justify-end gap-4 mt-4">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ReusableFormModal;
