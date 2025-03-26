import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const roles = ["Admin", "Staff", "Artist"];

const ModalNewUser = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "Staff",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("New user data:", formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <TextField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          margin="dense"
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalNewUser;
