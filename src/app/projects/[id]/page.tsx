"use client"

import React, { useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import { useGetProjectDetailsQuery } from "@/state/api";
import Header from "@/components/Header";
import { Box, Button } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import ModalNewMilestone from "../ModalNewMilestone";
import { useParams } from "next/navigation";


type Props = {
  params: { id: string };
};

const Project = () => {
  const params = useParams();
  const id = params?.id as string;
  const [isModalNewMilestoneOpen, setIsModalNewMilestoneOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Board");
  // const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const { data: projectDetails, error, isLoading, refetch } = useGetProjectDetailsQuery(id);

  if (isLoading) return <div>⏳ Đang tải dữ liệu...</div>;
  if (error || !projectDetails) return <div>❌ Không thể tải thông tin project.</div>;

  return (
    <div className="p-4">
      {/* <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      /> */}

      <ModalNewMilestone
        isOpen={isModalNewMilestoneOpen}
        onClose={() => {
          setIsModalNewMilestoneOpen(false);
          refetch(); // 👉 Load lại milestone sau khi tạo xong
        }}
        projectID={id}
      />

      <Box className="px-4 xl:px-6">
        <Box className="pb-6 pt-6 lg:pb-4 lg:pt-8">
          <Header
            name={projectDetails?.title}
          />
        </Box>
      </Box>

      {/* {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "List" && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Timeline" && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Table" && (
        <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )} */}

      <Box className="ml-6 mr-6">
        <Box className="mb-6 space-y-2">
          <Box display="flex" gap={2} flexDirection="column">
            <p className="text-gray-600">
              <strong>Description:</strong>{" "}
              {projectDetails.description}
            </p>
            <p className="text-gray-600">
              <strong>Content:</strong>{" "}
              {projectDetails.content}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {new Date(projectDetails.startTime).toLocaleDateString()} -{" "}
              {new Date(projectDetails.endTime).toLocaleDateString()}
            </p>
            <p>
              <strong>Created by:</strong> {`${projectDetails?.createdByInfo?.fullName} - ${projectDetails?.createdByInfo?.email}`}
            </p>
            <p>
              <strong>Assigned for:</strong> {projectDetails?.departments?.map((dep: { name: string }) => dep.name).join(", ")}
            </p>
          </Box>
        </Box>


        <Box marginTop={5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Header name="Milestones" />
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAdd />}
              onClick={() => setIsModalNewMilestoneOpen(true)}
              sx={{ minWidth: 160, whiteSpace: "nowrap" }} // Đảm bảo đủ rộng và không xuống dòng
            >
              New Milestone
            </Button>
          </Box>

          <ul className="space-y-3">
            {projectDetails.milestones
              .slice()
              .sort((a: { startDate: string }, b: { startDate: string }) =>
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
              )
              .map((m) => (
                <li key={m.milestoneID} className="p-4 border rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg">{m.title}</h3>
                  <p className="text-gray-500">{m.description}</p>
                  <p>
                    📅 {new Date(m.startDate).toLocaleDateString()} →{" "}
                    {new Date(m.endDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
          </ul>
        </Box>
      </Box>


    </div>



  );
};

export default Project;
