"use client";
import { useState } from "react";
import { useGetTeamsQuery } from "@/state/api";
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Box,
  Stack,
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

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, team: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeam(team);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeam(null);
  };

  if (isLoading)
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh">Loading...</Box>;
  if (isError || !teams)
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh">Error fetching teams</Box>;

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100, headerAlign: "center", align: "center" },
    {
      field: "name",
      headerName: "Department",
      width: 250,
      headerAlign: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={2} alignItems="center" width="100%">
          <Avatar alt={params.value} src={params.row.avatar} sx={{ width: 32, height: 32 }} />
          <Typography variant="body1" fontWeight="bold" color="primary">
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "dean",
      headerName: "Dean",
      width: 250,
      headerAlign: "center",
      renderCell: (params) => (
        <Stack>
          <Typography variant="body1" fontWeight="bold" color="primary">
            {params.value?.fullName || "N/A"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {params.value?.email || "N/A"}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2" color="textSecondary" noWrap>
          {params.value || "N/A"}
        </Typography>
      ),
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
    },
  ];

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Teams" />
      <DataGrid
        rows={teams}
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
            fontWeight: "700 !important",
            fontSize: "1rem",
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-cell": { display: "flex", justifyContent: "center", alignItems: "center" },
          width: "100%", maxWidth: 1200, p: 0, boxShadow: 4, borderRadius: 2, bgcolor: "#fafafa",
        }}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => alert(`Editing ${selectedTeam?.name}`)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => alert(`Deleting ${selectedTeam?.name}`)}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Teams;
