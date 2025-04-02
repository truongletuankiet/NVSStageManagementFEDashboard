import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useGetTeamsQuery, useCreateUserByAdminMutation } from "@/state/api";

const roles = [
  { id: 1, roleName: "Admin" },
  { id: 2, roleName: "Concert Master" },
  { id: 3, roleName: "Staff" },
  { id: 4, roleName: "Leader" },
];

const ModalNewUser = ({ open, onClose }) => {
  const { data: departments, isLoading, isError } = useGetTeamsQuery();
  const [createUserByAdmin, { isLoading: isCreating }] = useCreateUserByAdminMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    dayOfBirth: "",
    email: "",
    password: "",
    departmentId: "",
    pictureProfile: "",
    roleId: roles[2].id, // Mặc định là "Staff"
    status: "Active",
  });

  // Reset form khi mở modal
  useEffect(() => {
    if (open) {
      setFormData({
        fullName: "",
        dayOfBirth: "",
        email: "",
        password: "",
        departmentId: "",
        pictureProfile: "",
        roleId: roles[2].id,
        status: "Active",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await createUserByAdmin(formData).unwrap();
      alert("User created successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Failed to create user:", error);
      alert("Failed to create user: " + (error?.data?.message || "Unknown error"));
    }
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
          required
        />
        <TextField
          label="Date of Birth"
          name="dayOfBirth"
          type="date"
          value={formData.dayOfBirth}
          onChange={handleChange}
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          select
          label="Department"
          name="departmentId"
          value={formData.departmentId || ""}
          onChange={handleChange}
          fullWidth
          margin="dense"
          disabled={isLoading || isError}
        >
          {isLoading ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : isError ? (
            <MenuItem disabled>Error loading departments</MenuItem>
          ) : (
            departments?.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          label="Profile Picture URL"
          name="pictureProfile"
          value={formData.pictureProfile}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          select
          label="Role"
          name="roleId"
          value={formData.roleId}
          onChange={handleChange}
          fullWidth
          margin="dense"
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.roleName}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={isCreating}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isCreating}>
          {isCreating ? <CircularProgress size={24} /> : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalNewUser;
