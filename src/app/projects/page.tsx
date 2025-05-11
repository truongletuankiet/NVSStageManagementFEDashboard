"use client";

import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import { useGetProjectsQuery } from "@/state/api";
import { Link } from "react-router-dom";
import { formatDateTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const Projects = () => {
  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const router = useRouter();

  console.log("projects", projects);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return { bg: "#BBDEFB", text: "#1E88E5" }; // Xanh pastel
      case "IN_PROGRESS":
        return { bg: "#C8E6C9", text: "#388E3C" }; // Xanh lá pastel
      default:
        return { bg: "#E0E0E0", text: "#616161" }; // Xám pastel
    }
  };


  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "TITLE",
      flex: 3,
      renderCell: (params) => (
        <Stack style={{ cursor: 'pointer' }} justifyContent="center" height="100%" onClick={() => router.push(`/projects/${params.row.projectID}`)}>
          <Typography variant="body1" fontWeight="bold" color="primary">
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    { field: "projectTypeName", headerName: "PROJECT TYPE NAME", flex: 2 },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
      renderCell: (params) => {
        const status = params.value || "Unknown"; // Đảm bảo không bị lỗi undefined
        const { bg, text } = getStatusColor(status);
        return (
          <Chip
            label={status}
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
      field: "startTime", headerName: "START TIME", flex: 1, renderCell: (params) => {
        return (<Typography>{formatDateTime(params?.value)}</Typography>);
      }
    },
    {
      field: "endTime", headerName: "END TIME", flex: 1, renderCell: (params) => {
        return (<Typography>{formatDateTime(params?.value)}</Typography>);
      }
    },
    {
      field: "createdByInfo", headerName: "CREATED BY", flex: 2, renderCell: (params) => {
        return (<Typography>{params?.value?.fullName || "N/A"}</Typography>)
      }
    },
  ];


  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header name="Projects" />
      </Box>

      <DataGrid
        rows={projects || []}
        columns={columns}
        getRowId={(row) => row.projectID}
        pagination
        sx={{
          mx: "auto",
          "& .MuiDataGrid-row:nth-of-type(odd)": { backgroundColor: "#FFFFFF" },
          "& .MuiDataGrid-row:hover": { backgroundColor: "#e3f2fd" },
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "#2196F3",
            color: "black",
            fontWeight: "700 !important",
            fontSize: "1rem",
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "700 !important",
          },
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" }, p: 0, boxShadow: 4, borderRadius: 2, bgcolor: "#fafafa"
        }}
      />
    </div>

  );
};

export default Projects;