"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetUserByIdQuery,
  useGetProjectsByUserQuery,
  useGetRolesQuery,
  useGetTeamsQuery,
  useUpdateUserMutation,
} from "@/state/api";
import {
  Card,
  Typography,
  Avatar,
  Box,
  CircularProgress,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import { Work, History, Email, Business, CalendarToday, VerifiedUser } from "@mui/icons-material";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return { bg: "#C8E6C9", text: "#388E3C" };
    case "Inactive":
      return { bg: "#FFCDD2", text: "#C62828" };
    case "Pending":
      return { bg: "#FFF9C4", text: "#F9A825" };
    default:
      return { bg: "#E0E0E0", text: "#616161" };
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
};

const PersonalPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const isEditing = searchParams.get("edit") === "true";
  const { data: user, isLoading, isError } = useGetUserByIdQuery(id);
  const { data: projects, isLoading: isLoadingProjects } = useGetProjectsByUserQuery(id);
  const { data: roles } = useGetRolesQuery();
  const { data: departments } = useGetTeamsQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const router = useRouter();
  const [editedUser, setEditedUser] = useState({ fullName: "", email: "", dayOfBirth: "", departmentId: "", roleId: "" });

  const rolesMap = [
    { id: 1, roleName: "Admin" },
    { id: 2, roleName: "Concert Master" },
    { id: 3, roleName: "Staff" },
    { id: 4, roleName: "Leader" },
  ];

  useEffect(() => {
    if (!id) {
      router.push("/users");
      return;
    }
    if (isError) {
      alert("Error fetching user data. Redirecting to user list...");
      router.push("/users");
    }
  }, [id, isError, router]);

  useEffect(() => {
    if (user) {
      setEditedUser({
        fullName: user.fullName,
        email: user.email,
        dayOfBirth: user.dayOfBirth?.toString() || formatDate(user.dayOfBirth?.toString()),
        departmentId: user.department?.id,
        roleId: user.role?.roleName,
      });
    }
  }, [user]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          User not found
        </Typography>
      </Box>
    );
  }

  console.log("User data:", user);

  const { bg, text } = getStatusColor(user.status);

  // const handleSave = async () => {
  //   try {
  //     await updateUser({ id, ...editedUser }).unwrap();
  //     alert("User updated successfully!");
  //     router.push(`/users/${id}`);
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     alert("Failed to update user!");
  //   }
  // };

  const handleSave = async () => {
    if (!id) {
      alert("User ID is missing.");
      return;
    }
  
    try {
      // Gọi hook useUpdateUserMutation và truyền đúng tham số
      const result = await updateUser({ userId: id, data: editedUser }).unwrap(); // unwrapped để lấy kết quả hoặc lỗi từ API call
      alert("User updated successfully!");
      router.push(`/users/${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user!");
    }
  };
  
  

  return (
    <Box className="container h-full w-full bg-gradient-to-b from-blue-100 to-white p-8">
      <Header name={`User Detail`} />
      <Card sx={{ maxWidth: 900, mx: "auto", p: 4, borderRadius: 3, boxShadow: 5 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar src={user.pictureProfile || "/default-avatar.png"} alt={user.fullName} sx={{ width: 100, height: 100, border: "3px solid #3b82f6" }} />
          <Box>
            {isEditing ? (
              <TextField label="Full Name" fullWidth value={editedUser.fullName} onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })} />
            ) : (
              <Typography variant="h4" fontWeight="bold" color="primary">{user.fullName}</Typography>
            )}
            <Chip label={user.status} sx={{ backgroundColor: bg, color: text, fontWeight: "bold" }} />
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        <List>
          <ListItem>
            <ListItemIcon><Email color="primary" /></ListItemIcon>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Business color="primary" /></ListItemIcon>
            {isEditing ? (
              <Select fullWidth value={editedUser.departmentId} onChange={(e) => setEditedUser({ ...editedUser, departmentId: e.target.value })}>
                {departments?.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </Select>
            ) : (
              <ListItemText primary="Department" secondary={user.department?.name || "N/A"} />
            )}
          </ListItem>
          <ListItem>
            <ListItemIcon><CalendarToday color="primary" /></ListItemIcon>
            {isEditing ? (
              <TextField type="date" fullWidth value={editedUser.dayOfBirth} onChange={(e) => setEditedUser({ ...editedUser, dayOfBirth: e.target.value })} />
            ) : (
              <ListItemText primary="Date of Birth" secondary={formatDate(user.dayOfBirth?.toString())} />
            )}
          </ListItem>
          <ListItem>
            <ListItemIcon><Work /></ListItemIcon>
            {isEditing ? (
              <Select fullWidth value={editedUser.roleId} onChange={(e) => setEditedUser({ ...editedUser, roleId: e.target.value })}>
                {roles?.map((role) => (
                  <MenuItem key={role.id} value={role.id}>{role.roleName}</MenuItem>
                ))}
              </Select>
            ) : (
              <ListItemText primary="Role" secondary={rolesMap.find(r => r.id === parseInt(user.roleID))?.roleName || "Chưa có Role"} />
            )}
          </ListItem>

          <ListItem>
            <ListItemIcon><History /></ListItemIcon>
            <ListItemText primary="Account Created" secondary={formatDateTime(user.createDate)} />
          </ListItem>

        </List>
        {isEditing && (
          <Button variant="contained" color="primary" onClick={handleSave} disabled={isUpdating} sx={{ mt: 2, borderRadius: "20px" }}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </Card>

       {/* Danh sách Project */}
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Projects Managed by {user.fullName}
        </Typography>
        {isLoadingProjects ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={2}>
            <CircularProgress />
          </Box>
        ) : projects && projects.length > 0 ? (
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} key={project.projectID}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No projects found.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PersonalPage;
