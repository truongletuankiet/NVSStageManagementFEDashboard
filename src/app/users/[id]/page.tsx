"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useGetUserByIdQuery } from "@/state/api";
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
} from "@mui/material";
import { Work, History, Email, Business, CalendarToday, VerifiedUser } from "@mui/icons-material";
import Header from "@/components/Header";

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
  return date.toLocaleDateString("vi-VN"); // Định dạng ngày theo tiếng Việt (dd/mm/yyyy)
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN"); // Định dạng ngày giờ theo tiếng Việt
};

const PersonalPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data: user, isLoading, isError } = useGetUserByIdQuery(id);
  const router = useRouter();

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

  return (
    <Box className="container h-full w-full bg-gray-100 p-8">
      <Header name={`User: ${user.fullName}`} />
      <Card sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
            src={user.pictureProfile || "/default-avatar.png"} 
            alt={user.fullName} 
            sx={{ width: 80, height: 80 }} 
          />
          <Box>
            <Typography variant="h5" fontWeight="bold">{user.fullName}</Typography>
            <Typography variant="body1" color="textSecondary">{user.email}</Typography>
            <Chip
              label={user.status}
              sx={{ backgroundColor: bg, color: text, fontWeight: "bold" }}
            />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem>
            <ListItemIcon><Business /></ListItemIcon>
            <ListItemText primary="Department" secondary={user.department?.name || "N/A"} />
          </ListItem>
          <ListItem>
            <ListItemIcon><CalendarToday /></ListItemIcon>
            {/* <ListItemText primary="Date of Birth" secondary={formatDate(user.dayOfBirth)} /> */}
          </ListItem>
          <ListItem>
            <ListItemIcon><Email /></ListItemIcon>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <ListItem>
            <ListItemIcon><VerifiedUser /></ListItemIcon>
            <ListItemText primary="User ID" secondary={user.id} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Work /></ListItemIcon>
            {/* <ListItemText primary="Role ID" secondary={user.roleID || "N/A"} /> */}
          </ListItem>
          <ListItem>
            <ListItemIcon><History /></ListItemIcon>
            <ListItemText primary="Account Created" secondary={formatDateTime(user.createDate)} />
          </ListItem>
        </List>
      </Card>
    </Box>
  );
};

export default PersonalPage;
