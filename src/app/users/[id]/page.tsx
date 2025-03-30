"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetUserByIdQuery, useGetProjectsByUserQuery } from "@/state/api";
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
  const router = useRouter();
  const [editedUser, setEditedUser] = useState({ fullName: "", email: "", dayOfBirth: "", department: "", role: "" });

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
        dayOfBirth: user.dayOfBirth,
        department: user.department?.name || "",
        role: user.role?.roleName || "",
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

  const { bg, text } = getStatusColor(user.status);

  const handleSave = () => {
    console.log("Saving...", editedUser);
    // TODO: Call API to update user details
  };

  return (
    <Box className="container h-full w-full bg-gray-100 p-8">
      <Header name={`User: ${user.fullName}`} />
      <Card sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={user.pictureProfile || "/default-avatar.png"} alt={user.fullName} sx={{ width: 80, height: 80 }} />
          <Box>
            {isEditing ? (
              <TextField label="Full Name" variant="outlined" fullWidth value={editedUser.fullName} onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })} />
            ) : (
              <Typography variant="h5" fontWeight="bold">{user.fullName}</Typography>
            )}
            <Typography variant="body1" color="textSecondary">{user.email}</Typography>
            <Chip label={user.status} sx={{ backgroundColor: bg, color: text, fontWeight: "bold" }} />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem>
            <ListItemIcon><Business /></ListItemIcon>
            {isEditing ? (
              <TextField label="Department" fullWidth value={editedUser.department} onChange={(e) => setEditedUser({ ...editedUser, department: e.target.value })} />
            ) : (
              <ListItemText primary="Department" secondary={user.department?.name || "N/A"} />
            )}
          </ListItem>
          <ListItem>
            <ListItemIcon><CalendarToday /></ListItemIcon>
            {isEditing ? (
              <TextField type="date" fullWidth value={editedUser.dayOfBirth} onChange={(e) => setEditedUser({ ...editedUser, dayOfBirth: e.target.value })} />
            ) : (
              <ListItemText primary="Date of Birth" secondary={formatDate(user.dayOfBirth)} />
            )}
          </ListItem>
          <ListItem>
            <ListItemIcon><Work /></ListItemIcon>
            {isEditing ? (
              <TextField label="Role" fullWidth value={editedUser.role} onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })} />
            ) : (
              <ListItemText primary="Role" secondary={user.role?.roleName || "Chưa có Role"} />
            )}
          </ListItem>

          <ListItem>
            <ListItemIcon><History /></ListItemIcon>
            <ListItemText primary="Account Created" secondary={formatDateTime(user.createDate)} />
          </ListItem>

        </List>
        {isEditing && (
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
            Save
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
              <Grid item xs={12} sm={6} key={project.id}>
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
