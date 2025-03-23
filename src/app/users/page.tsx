"use client";
import { useState } from "react";
import { useGetUsersQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import React from "react";
import { CircularProgress } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Divider,
  ListItemIcon,
  Tooltip,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { Edit, Delete, MoreVert } from "@mui/icons-material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Header from "@/components/Header";

const CustomToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

// Chọn màu theo Role
const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return { bg: "#FFCDD2", text: "#C62828" }; // Đỏ pastel
    case "Staff":
      return { bg: "#BBDEFB", text: "#1E88E5" }; // Xanh pastel
    case "Artist":
      return { bg: "#C8E6C9", text: "#388E3C" }; // Xanh lá pastel
    default:
      return { bg: "#E0E0E0", text: "#616161" }; // Xám pastel
  }
};


const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const router = useRouter();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  if (isLoading) 
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>;
  
  if (isError || !users) return <Box display="flex" justifyContent="center" alignItems="center" height="100vh">Error fetching users</Box>;

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100, headerAlign: "center", align: "center" },
    {
      field: "fullName",
      headerName: "FULL NAME",
      width: 250,
      headerAlign: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" width="100%" onClick={() => router.push(`/users/${params.row.id}`)}>
          
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              alt={params.value}
              src={params.row.pictureProfile}
              sx={{ width: 32, height: 32 }}
            />
            {params.row.status === "Active" && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  backgroundColor: "#4CAF50", // Xanh lá
                  borderRadius: "50%",
                  border: "1.5px solid white",
                }}
              />
            )}
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold" color="primary">
              {params.value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {params.row.email}
            </Typography>
          </Box>
        </Stack>
      ),
      
    },
    
    {
      field: "department",
      headerName: "Department",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <Typography>{params.value?.name || "N/A"}</Typography>,
    },
    {
      field: "role",
      headerName: "ROLE",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const roleName = params.value?.roleName || "Unknown"; // Đảm bảo không bị lỗi undefined
        const { bg, text } = getRoleColor(roleName);
        return (
          <Chip
            label={roleName}
            sx={{
              backgroundColor: bg,
              color: text,
              fontSize: "10px",
              fontWeight: "bold",
              borderRadius: "3px",
              border: "none",
              padding: "0px",
              minHeight: "16px",
              height: "16px",
              "& .MuiChip-label": {
                padding: "0px 4px",
              },
            }}
          />
        );
      },
    },
    
    
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 100,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="More actions">
          <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
            <MoreVert />
          </IconButton>
        </Tooltip>
      ),
    }
  ];

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Users" />
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
        pagination
        slots={{ toolbar: CustomToolbar }}
        sx={{
          "& .MuiDataGrid-row:nth-of-type(odd)": { backgroundColor: "#FFFFFF" },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#e3f2fd" },
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "#2196F3",
            color: "black",
            fontWeight: "700 !important", // Sử dụng "700" thay vì "bold"
            fontSize: "1rem",
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "700 !important",  // Định dạng tiêu đề cột
          },

          "& .MuiDataGrid-cell": { display: "flex", justifyContent: "center", alignItems: "center" },
          width: "100%", maxWidth: 1200, p: 0, boxShadow: 4, borderRadius: 2, bgcolor: "#fafafa"
        }}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => alert(`Editing ${selectedUser?.fullName}`)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => alert(`Deleting ${selectedUser?.fullName}`)}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Users;
