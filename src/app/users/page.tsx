"use client";
import { useState } from "react";
import { useGetUsersQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import React from "react";
import { CircularProgress, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Snackbar } from "@mui/material";


import ModalNewUser from "./ModalNewUser";
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
import { Edit, Delete, MoreVert, PersonAdd } from "@mui/icons-material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Header from "@/components/Header";

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
  const [openNewUserModal, setOpenNewUserModal] = useState(false);
  const router = useRouter();
  const [copyMessageOpen, setCopyMessageOpen] = useState(false);


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
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      align: "left",
      headerAlign: "left",
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Copy ID">
          <IconButton
            size="small"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(params.value);
                setCopyMessageOpen(true); // Mở Snackbar báo thành công
              } catch (err) {
                console.error("Failed to copy: ", err);
                alert("Copy failed. Your browser may not support it.");
              }
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )

    },

    {
      field: "fullName",
      headerName: "FULL NAME",
      flex: 3.5,
      align: "left",
      headerAlign: "left",
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
      align: "left",
      headerAlign: "left",
      flex: 2.5,
      renderCell: (params) => <Typography>{params.value?.name || "N/A"}</Typography>,
    },
    {
      field: "role",
      headerName: "ROLE",
      align: "left",
      headerAlign: "left",
      flex: 1.5,
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
      flex: 1.5,
      align: "left",
      headerAlign: "left",
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header name="Users" />
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={() => setOpenNewUserModal(true)}
          sx={{ minWidth: 160, whiteSpace: "nowrap" }}
        >
          New User
        </Button>
      </Box>


      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
        pagination
        sx={{
          mx: "auto", // 👈 căn giữa theo chiều ngang
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

          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center"}, p: 0, boxShadow: 4, borderRadius: 2, bgcolor: "#fafafa"
        }}
      />



      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => {
          if (selectedUser?.id) {
            router.push(`/users/${selectedUser.id}?edit=true`);
          }
          handleMenuClose();
        }}>
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
      <ModalNewUser open={openNewUserModal} onClose={() => setOpenNewUserModal(false)} />
      <Snackbar
        open={copyMessageOpen}
        autoHideDuration={2000}
        onClose={() => setCopyMessageOpen(false)}
        message="ID copied to clipboard!"
      />

    </div>
  );
};

export default Users;
