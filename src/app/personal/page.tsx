"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetUserByIdQuery } from "@/state/api";
import {
  Card,
  CardContent,
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
import { Work, History, Email, Business } from "@mui/icons-material";
import Header from "@/components/Header";

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return { bg: "#FFCDD2", text: "#C62828" };
    case "Staff":
      return { bg: "#BBDEFB", text: "#1E88E5" };
    case "Artist":
      return { bg: "#C8E6C9", text: "#388E3C" };
    default:
      return { bg: "#E0E0E0", text: "#616161" };
  }
};

const PersonalPage = () => {
  const { id } = useParams() as { id: string };
  const { data: user, isLoading, isError } = useGetUserByIdQuery(id);
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      alert("Error fetching user data. Redirecting to user list...");
      router.push("/users");
    }
  }, [isError, router]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  if (!user) return null;

  const { bg, text } = getRoleColor(user.role?.roleName || "Unknown");

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
              label={user.role?.roleName || "Unknown"}
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
            <ListItemIcon><Email /></ListItemIcon>
            <ListItemText primary="Email" secondary={user.email} />
          </ListItem>
          <ListItem>
            <ListItemIcon><Work /></ListItemIcon>
            {/* <ListItemText primary="Projects" secondary={user.projects?.map(p => p.name).join(", ") || "No projects available"} /> */}
          </ListItem>
          <ListItem>
            <ListItemIcon><History /></ListItemIcon>
            {/* <ListItemText primary="Recent Activity" secondary={user.recentActivity ?? "No recent activity"} /> */}
          </ListItem>
        </List>
      </Card>
    </Box>
  );
};

export default PersonalPage;
