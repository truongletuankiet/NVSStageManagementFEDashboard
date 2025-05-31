"use client";

import React, { useEffect } from "react";
import { Box, Typography, Stack, Card, CardContent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetProjectsQuery } from "@/state/api";
import { formatDateTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Layers } from "lucide-react";

const Projects = () => {
  const { data: projects, isLoading, refetch } = useGetProjectsQuery();
  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "TÊN DỰ ÁN",
      flex: 2,
      minWidth: 200,
      filterable: true,
      renderCell: (params) => (
        <Stack
          direction="row"
          alignItems="center"
          sx={{ cursor: "pointer" }}
          spacing={1}
          onClick={() => router.push(`/projects/${params.row.projectID}`)}
        >
          <Layers size={18} color="#2196F3" />
          <Typography fontWeight="bold" color="primary">
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "projectTypeName",
      headerName: "LOẠI DỰ ÁN",
      flex: 1,
      minWidth: 130,
      filterable: true,
    },
    {
      field: "startTime",
      headerName: "BẮT ĐẦU",
      flex: 1,
      minWidth: 140,
      filterable: true,
      renderCell: (params) => (
        <Typography fontSize={14}>{formatDateTime(params.value)}</Typography>
      ),
    },
    {
      field: "endTime",
      headerName: "KẾT THÚC",
      flex: 1,
      minWidth: 140,
      filterable: true,
      renderCell: (params) => (
        <Typography fontSize={14}>{formatDateTime(params.value)}</Typography>
      ),
    },
    {
      field: "createdByInfo",
      headerName: "NGƯỜI TẠO",
      flex: 1,
      minWidth: 150,
      filterable: true,
      renderCell: (params) => (
        <Typography fontSize={14}>
          {params?.value?.fullName || "N/A"}
        </Typography>
      ),
    },
  ];

  return (
    <Box
      className="container"
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        py: 4,
        px: { xs: 1, md: 6 },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        mb={3}
        flexWrap="wrap"
      >
        <Header name="Danh sách Dự án" />
      </Box>

      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 18px 0 #b8cef640",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={projects || []}
            columns={columns}
            getRowId={(row) => row.projectID}
            autoHeight
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            loading={isLoading}
            sx={{
              bgcolor: "#fff",
              borderRadius: 3,
              fontSize: 15,
              px: 1,
              "& .MuiDataGrid-row": {
                cursor: "pointer",
                transition: "background 0.2s",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                background: "#f8fbff",
              },
              "& .MuiDataGrid-row:hover": {
                background: "#e3f2fd",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#2196f3",
                color: "#fff",
                fontWeight: "700 !important",
                fontSize: "1rem",
                textTransform: "uppercase",
                border: 0,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold !important",
                letterSpacing: 1,
              },
              // Fix filter input hiện rõ chữ
              "& .MuiDataGrid-columnHeader .MuiInputBase-root": {
                bgcolor: "#fff",
                color: "#222",
                fontWeight: 500,
                borderRadius: 1,
                px: 1,
                py: 0.2,
                fontSize: 14,
              },
              "& .MuiDataGrid-columnHeader .MuiInputBase-input": {
                color: "#222",
                fontWeight: 500,
              },
              "& .MuiDataGrid-cell": {
                alignItems: "center",
                py: 1,
                fontSize: 15,
              },
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Projects;
