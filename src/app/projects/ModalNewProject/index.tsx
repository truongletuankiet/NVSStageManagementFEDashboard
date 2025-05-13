import Modal from "@/components/Modal";
import { Department, useCreateProjectMutation, useGetDepartmentsQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";
import { on } from "events";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
} from "@mui/material";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const { data: departments = [], isLoading: isDepartmentsLoading } = useGetDepartmentsQuery();

  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [projectTypeID, setProjectTypeID] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);



  useEffect(() => {

    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log("Parsed User:", parsedUser);
      setCreatedBy(parsedUser.userId);
    }
  }, []);


  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedEndDate = formatISO(new Date(endDate), {
      representation: "complete",
    });

    const res = await createProject({
      title: projectName,
      description,
      content,
      startTime: formattedStartDate,
      endTime: formattedEndDate,
      projectTypeID,
      createdBy,
      departments: selectedDepartments,
    }).unwrap();

    onClose();

  };

  const isFormValid = () => {
    return projectName && description && startDate && endDate && projectTypeID;
  };


  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  console.log("Departments:", selectedDepartments);

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <select
          className={inputStyles}
          value={projectTypeID}
          onChange={(e) => setProjectTypeID(e.target.value)}
        >
          <option value="">Select Project Type</option>
          <option value="1">Goverment</option>
          <option value="2">Academic</option>
          <option value="3">Private</option>
        </select>
        <FormControl fullWidth>
          <Select
            labelId="department-multiselect-label"
            multiple
            value={selectedDepartments}
            onChange={(e) => setSelectedDepartments(e.target.value as string[])}
            renderValue={(selected) => {
              if ((selected as string[]).length === 0) {
                return <span>No departments selected</span>;
              }
              return departments
                .filter((dept) => selected.includes(dept.id))
                .map((dept) => dept.name)
                .join(", ");
            }}
            displayEmpty
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                <Checkbox checked={selectedDepartments.includes(dept.id)} />
                <ListItemText primary={dept.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
