import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockUsers as mockUsersArray } from "../../public/mockUsers";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";

export interface Project {
  projectID: string; // ID của dự án (UUID)
  title: string; // Tên dự án
  description?: string; // Mô tả dự án (có thể null)
  content?: string; // Nội dung chi tiết (có thể null)
  startTime: string; // Thời gian bắt đầu (ISO String)
  endTime: string; // Thời gian kết thúc (ISO String)
  department?: string; // Thông tin phòng ban (hiện tại API trả về "[]", có thể null)
  createdBy: string; // Người tạo dự án
  projectTypeID: string;
  projectTypeName: string;
  departments: string[]; // Danh sách ID phòng ban liên quan
}

export interface Role {
  id: number;
  roleName: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  id: string;
  fullName: string;
  dayOfBirth: string | null;
  email: string;
  password: string;
  department: {
    id: string;
    name: string;
    description: string | null;
  };
  pictureProfile?: string | null;
  createDate: string;
  role: {
    id: number;
    roleName: string;
  };
  status: string;
  taskUsers: {
    taskID: string;
    userID: string | null;
  }[];
  roleID: string;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string;
  taskId: number;
  uploadedById: number;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  users: User[];
}

// types.ts hoặc ngay trong file api nếu chưa tách
export interface Milestone {
  title: string;
  description: string;
  startDate: string; // ISO format: "2025-04-09"
  endDate: string; // ISO format
  projectID: string;
  events: any[]; // có thể khai báo cụ thể hơn nếu biết rõ
}

export interface Department {
  id: string;
  name: string;
}

// === MOCK DATA ===
const mockTeams: Team[] = [
  {
    id: 1,
    name: "Vietnamese Traditional Music",
    description: "Team specializing in traditional Vietnamese music.",
  },
  {
    id: 2,
    name: "Western Musical Instruments",
    description: "Team focusing on Western musical instruments.",
  },
  {
    id: 3,
    name: "Vocal Performance",
    description: "Team dedicated to vocal training and performances.",
  },
  {
    id: 4,
    name: "Stage Performance Management",
    description: "Team responsible for managing stage performances.",
  },
  {
    id: 5,
    name: "Resource and Equipment Management",
    description: "Team handling resource and equipment logistics.",
  },
];

const mockUsers: User[] = mockUsersArray;

const mockProjects: Project[] = [
  {
    id: 1,
    name: "La Traviata Stage Production",
    description:
      "A full-scale production of Verdi's 'La Traviata', featuring elaborate stage design and live orchestration.",
    startDate: "2025-03-01",
    endDate: "2025-08-30",
  },
  {
    id: 2,
    name: "The Magic Flute Interactive Experience",
    description:
      "An immersive performance of Mozart's 'The Magic Flute' with digital projections and audience participation.",
    startDate: "2025-04-15",
    endDate: "2025-10-10",
  },
  {
    id: 3,
    name: "Carmen Open-Air Performance",
    description:
      "An outdoor rendition of Bizet's 'Carmen' set in a grand plaza, blending traditional and modern elements.",
    startDate: "2025-05-20",
    endDate: "2025-09-15",
  },
  {
    id: 4,
    name: "Aida Grand Stage Adaptation",
    description:
      "A large-scale production of Verdi’s 'Aida' with intricate set designs and a massive cast.",
    startDate: "2025-02-10",
    endDate: "2025-07-25",
  },
  {
    id: 5,
    name: "Don Giovanni Virtual Reality Opera",
    description:
      "A high-tech adaptation of Mozart’s 'Don Giovanni', incorporating VR elements for an immersive experience.",
    startDate: "2025-06-01",
    endDate: "2025-12-15",
  },
  {
    id: 6,
    name: "Tosca Historical Performance",
    description:
      "A historically accurate performance of Puccini’s 'Tosca' with period costumes and set designs.",
    startDate: "2025-07-10",
    endDate: "2025-11-30",
  },
  {
    id: 7,
    name: "The Barber of Seville Comedy Opera",
    description:
      "A lively and humorous staging of Rossini’s 'The Barber of Seville', emphasizing its comedic elements.",
    startDate: "2025-08-05",
    endDate: "2025-12-20",
  },
  {
    id: 8,
    name: "Turandot Spectacular Lighting Show",
    description:
      "A production of Puccini’s 'Turandot' featuring state-of-the-art lighting and 3D mapping technology.",
    startDate: "2025-09-01",
    endDate: "2026-02-28",
  },
  {
    id: 9,
    name: "Rigoletto Street Opera Festival",
    description:
      "A unique street performance of Verdi’s 'Rigoletto', bringing opera to unconventional outdoor spaces.",
    startDate: "2025-10-15",
    endDate: "2026-03-10",
  },
  {
    id: 10,
    name: "The Flying Dutchman Nautical Opera",
    description:
      "A water-based production of Wagner’s 'The Flying Dutchman', performed on a floating stage.",
    startDate: "2025-11-01",
    endDate: "2026-04-15",
  },
];

const mockTasks: Task[] = [
  // Tasks for La Traviata Stage Production
  {
    id: 1,
    title: "Setup stage lighting",
    description: "Install and configure lighting system.",
    status: Status.ToDo,
    priority: Priority.High,
    projectId: 1,
    authorUserId: 1,
    assignedUserId: 2,
    startDate: "2025-02-10",
    dueDate: "2025-03-01",
  },
  {
    id: 2,
    title: "Coordinate costume fitting",
    description: "Arrange fittings for main cast.",
    status: Status.WorkInProgress,
    priority: Priority.Medium,
    projectId: 1,
    authorUserId: 2,
    assignedUserId: 3,
    startDate: "2025-02-15",
    dueDate: "2025-03-10",
  },
  {
    id: 3,
    title: "Rehearsal scheduling",
    description: "Plan and finalize rehearsal schedule.",
    status: Status.ToDo,
    priority: Priority.High,
    projectId: 1,
    authorUserId: 3,
    assignedUserId: 4,
    startDate: "2025-02-20",
    dueDate: "2025-03-15",
  },
  {
    id: 4,
    title: "Marketing campaign launch",
    description: "Kickstart online and offline marketing.",
    status: Status.ToDo,
    priority: Priority.Urgent,
    projectId: 1,
    authorUserId: 4,
    assignedUserId: 1,
    startDate: "2025-03-01",
    dueDate: "2025-04-01",
  },
  {
    id: 5,
    title: "Technical rehearsal",
    description: "Run full dress rehearsal with tech elements.",
    status: Status.ToDo,
    priority: Priority.High,
    projectId: 1,
    authorUserId: 1,
    assignedUserId: 2,
    startDate: "2025-03-10",
    dueDate: "2025-03-30",
  },

  // Tasks for The Magic Flute Interactive Experience
  {
    id: 6,
    title: "Develop interactive visuals",
    description: "Create digital projections for audience engagement.",
    status: Status.WorkInProgress,
    priority: Priority.Medium,
    projectId: 2,
    authorUserId: 3,
    assignedUserId: 4,
    startDate: "2025-03-15",
    dueDate: "2025-05-01",
  },
  {
    id: 7,
    title: "Build augmented reality app",
    description: "Develop AR experience for audience.",
    status: Status.ToDo,
    priority: Priority.High,
    projectId: 2,
    authorUserId: 1,
    assignedUserId: 3,
    startDate: "2025-04-01",
    dueDate: "2025-06-01",
  },
  {
    id: 8,
    title: "Choreography refinement",
    description: "Finalize choreography for stage movement.",
    status: Status.ToDo,
    priority: Priority.Medium,
    projectId: 2,
    authorUserId: 2,
    assignedUserId: 1,
    startDate: "2025-04-10",
    dueDate: "2025-05-20",
  },
  {
    id: 9,
    title: "Community engagement event",
    description: "Host pre-show discussions and workshops.",
    status: Status.ToDo,
    priority: Priority.Low,
    projectId: 2,
    authorUserId: 4,
    assignedUserId: 2,
    startDate: "2025-04-20",
    dueDate: "2025-06-10",
  },
  {
    id: 10,
    title: "Stage setup",
    description: "Arrange stage props and effects.",
    status: Status.ToDo,
    priority: Priority.High,
    projectId: 2,
    authorUserId: 3,
    assignedUserId: 4,
    startDate: "2025-04-25",
    dueDate: "2025-06-15",
  },
];

// === API ENDPOINTS (FAKE) ===
export const api = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
  endpoints: (build) => ({
    // getAuthUser: build.query<User, void>({
    //   queryFn: async () => {
    //     return { data: mockUsers[0] }; // Trả về user đầu tiên
    //   },
    // }),
    getAuthUser: build.query<User | null, void>({
      queryFn: async () => {
        try {
          const storedUser = localStorage.getItem("user"); // 🔄 Lấy từ localStorage
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { data: null };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { data: null };
          }

          console.log("🔍 Fetching authenticated user info...");

          const response = await axios.get(
            `${BASE_URL}/api/v1/user/my-info`,
            {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`, // 🔥 Thêm token vào headers
              },
            },
          );

          if (!response.data || response.data.code !== 1000) {
            alert("❌ Failed to fetch authenticated user");
          }

          const user: User = response.data.result;
          console.log(
            `✅ Successfully fetched authenticated user: ${user.fullName}`,
          );

          return { data: user };
        } catch (error) {
          console.error("❌ Error fetching authenticated user:", error);
          return {
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    }),

    getProjects: build.query<Project[], void>({
      queryFn: async () => {
        try {
          console.log("🔍 Fetching all projects from API...");

          // 🛑 Lấy token từ localStorage
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          // 🔥 Gửi request có kèm token
          const response = await axios.get(
            `${BASE_URL}/api/v1/project`,
            {
              headers: { Authorization: `Bearer ${parsedUser.token}` },
            },
          );

          if (!response.data) {
            console.error(
              "❌ Failed to fetch projects. Response:",
              response.data,
            );
            alert("Failed to fetch projects");
          }

          const projects: Project[] = response.data;
          if (!Array.isArray(projects)) {
            alert("❌ Invalid project data format");
          }

          console.log(`✅ Successfully fetched ${projects.length} projects`);
          return { data: projects };
        } catch (error) {
          console.error("❌ Error fetching projects:", error);
          return {
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    }),

    getProjectsByUser: build.query<Project[], string>({
      queryFn: async (userId) => {
        try {
          console.log(`🔍 Fetching projects for user: ${userId}`);

          // 🛑 Lấy token từ localStorage
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          // 🔥 Gửi request có kèm token
          const response = await axios.get(
            `${BASE_URL}/api/v1/project/userId?userId=${userId}`,
            {
              headers: { Authorization: `Bearer ${parsedUser.token}` },
            },
          );

          if (!response.data) {
            console.error(
              "❌ Failed to fetch projects for user:",
              response.data,
            );
            alert("Failed to fetch projects");
          }

          const projects: Project[] = response.data;
          if (!Array.isArray(projects)) {
            alert("❌ Invalid project data format");
          }

          console.log(
            `✅ Successfully fetched ${projects.length} projects for user ${userId}`,
          );
          return { data: projects };
        } catch (error) {
          console.error("❌ Error fetching projects for user:", error);
          return {
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    }),

    createProject: build.mutation<Project, Partial<Project>>({
      queryFn: async (project) => {
        try {
          console.log("🚀 Creating new project...");

          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          const token = parsedUser?.token;

          if (!token) {
            console.warn("⚠️ Invalid or missing authentication token.");
            return { error: "Invalid authentication token" };
          }

          const response = await axios.post(
            `${BASE_URL}/api/v1/project`,
            project,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );
          console.log(response);
          // Kiểm tra response
          if (response.status === 201 && response.data) {
            alert("✅ Project created successfully");
            return { data: response.data };
          } else {
            console.error("❌ Unexpected response:");
            return { error: "Unexpected response from server" };
          }
        } catch (error: any) {
          alert("❌ Failed to create project");
          console.error("❌ Error creating project:", error);
          return {
            error:
              error.response?.data?.message || error.message || "Unknown error",
          };
        }
      },
    }),

    getTasks: build.query<Task[], { projectId: number }>({
      queryFn: async ({ projectId }) => {
        return {
          data: mockTasks.filter((task) => task.projectId === projectId),
        };
      },
    }),
    getTasksByUser: build.query<Task[], number>({
      queryFn: async (userId) => {
        return {
          data: mockTasks.filter((task) => task.assignedUserId === userId),
        };
      },
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      queryFn: async (task) => {
        const newTask = { ...task, id: mockTasks.length + 1 } as Task;
        mockTasks.push(newTask);
        return { data: newTask };
      },
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      queryFn: async ({ taskId, status }) => {
        const taskIndex = mockTasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return { error: "Task not found" };
        mockTasks[taskIndex].status = status as Status;
        return { data: mockTasks[taskIndex] };
      },
    }),
    getUsers: build.query<User[], void>({
      queryFn: async () => {
        try {
          console.log("🔍 Fetching all users from API...");

          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          const response = await axios.get(
            `${BASE_URL}/api/v1/user/get-all`,
            {
              headers: { Authorization: `Bearer ${parsedUser.token}` },
            },
          );

          if (!response.data || response.data.code !== 1000) {
            console.error("❌ Failed to fetch users. Response:", response.data);
            alert("Failed to fetch users");
          }

          const users: User[] = response.data.result;
          if (!Array.isArray(users)) {
            alert("❌ Invalid user data format");
          }

          console.log(`✅ Successfully fetched ${users.length} users`);
          return { data: users };
        } catch (error) {
          console.error("❌ Error fetching users:", error);
          return {
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    }),

    getUserById: build.query<User, string>({
      queryFn: async (userId) => {
        try {
          console.log(`🔍 Fetching user with ID: ${userId} from API...`);

          // 🛑 Lấy token từ sessionStorage
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          // 🔥 Gửi request có kèm token
          const response = await axios.get(
            `${BASE_URL}/api/v1/user/${userId}`,
            {
              headers: { Authorization: `Bearer ${parsedUser.token}` },
            },
          );

          if (!response.data) {
            console.error("❌ Failed to fetch user. Response:", response.data);
            alert("Failed to fetch user");
          }

          // ✅ Kiểm tra nếu response đúng format
          if (
            !response.data?.result ||
            typeof response.data.result !== "object"
          ) {
            alert("Invalid user data");
          }

          console.log(response.data.result);
          return { data: response.data.result }; // 👈 Sửa lại đúng key chứa user
        } catch (error) {
          console.error("❌ Error fetching user:", error);
          return {
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    }),

    getTeams: build.query<Team[], void>({
      queryFn: async () => {
        try {
          console.log("🔍 Fetching all teams from API...");

          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          // 🔥 Gửi request có kèm token
          const response = await fetch(
            `${BASE_URL}/api/v1/departments`,
            {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            alert("Failed to fetch teams");
          }

          const data = await response.json();
          console.log(`✅ Successfully fetched ${data.length} teams`);
          return { data };
        } catch (error) {
          console.error("❌ Error fetching teams:", error);
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
    }),

    search: build.query<SearchResults, string>({
      queryFn: async (query) => {
        const filteredUsers = mockUsers.filter((u) =>
          u.id.toLowerCase().includes(query.toLowerCase()),
        );
        const filteredProjects = mockProjects.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase()),
        );
        const filteredTasks = mockTasks.filter((t) =>
          t.title.toLowerCase().includes(query.toLowerCase()),
        );

        return {
          data: {
            users: filteredUsers,
            projects: filteredProjects,
            tasks: filteredTasks,
          },
        };
      },
    }),

    createUserByAdmin: build.mutation<
      { success: boolean },
      { name: string; email: string; role: string }
    >({
      queryFn: async (userData) => {
        try {
          console.log("🚀 Creating user by admin:", userData);

          // 🛑 Lấy token từ sessionStorage
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          // 🔥 Gửi request có kèm token
          const response = await axios.post(
            `${BASE_URL}/api/v1/user`,
            userData,
            {
              headers: { Authorization: `Bearer ${parsedUser.token}` },
            },
          );

          if (!response.data) {
            console.error("❌ Failed to create user. Response:", response.data);
            alert("Failed to create user");
          }

          return { data: { success: true } };
        } catch (error) {
          console.error("❌ Error creating user:", error);
          return {
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    }),

    getRoles: build.query<Role[], void>({
      queryFn: async () => {
        console.log("🔍 Returning fixed roles...");

        // Danh sách vai trò cố định
        const fixedRoles: Role[] = [
          { id: 1, roleName: "Admin" },
          { id: 2, roleName: "Concert Master" },
          { id: 3, roleName: "Staff" },
          { id: 4, roleName: "Leader" },
        ];

        console.log(
          `✅ Successfully returned ${fixedRoles.length} fixed roles`,
        );
        return { data: fixedRoles };
      },
    }),

    updateUser: build.mutation<User, { userId: string; data: Partial<User> }>({
      queryFn: async ({ userId, data }) => {
        try {
          console.log(`🔄 Updating user with ID: ${userId}`);

          // Thêm thuộc tính password vào data
          const updatedData = {
            ...data,
            password: "abc123",
            pictureProfile: "string",
          }; // Thêm password vào data

          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "Invalid authentication token" };
          }

          const response = await axios.put(
            `${BASE_URL}/api/v1/user/${userId}`,
            updatedData, // Sử dụng updatedData thay vì data gốc
            {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.data || response.data.code !== 1000) {
            alert("❌ Failed to update user");
          }

          console.log("✅ User updated successfully:", response.data.result);
          return { data: response.data.result };
        } catch (error) {
          console.error("❌ Error updating user:", error);
          return {
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      },
    }),

    getProjectMilestone: build.query<any, void>({
      queryFn: async () => {
        try {
          console.log("🔍 Fetching project milestones from API...");

          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          const response = await fetch(
            `${BASE_URL}/api/v1/project/project-milestone`,
            {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            alert("Failed to fetch project milestones");
          }

          const data = await response.json();
          console.log(`✅ Successfully fetched ${data.length} milestones`);
          return { data };
        } catch (error: any) {
          console.error("❌ Error fetching project milestones:", error);
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
    }),

    getProjectDetails: build.query<any, string>({
      queryFn: async (projectId: string) => {
        try {
          console.log(`🔍 Fetching project details for ID: ${projectId}...`);

          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          const response = await fetch(
            `${BASE_URL}/api/v1/project/${projectId}/details`,
            {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            alert("Failed to fetch project details");
          }

          const data = await response.json();
          console.log("✅ Successfully fetched project details:", data);
          return { data };
        } catch (error: any) {
          console.error("❌ Error fetching project details:", error);
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
    }),

    createMilestone: build.mutation<any, Milestone>({
      queryFn: async (milestoneData: Milestone) => {
        try {
          console.log("🛠️ Creating milestone with data:", milestoneData);

          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return {
              error: { status: 401, message: "User not authenticated" },
            };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: { status: 401, message: "Invalid token" } };
          }

          const response = await fetch(
            `${BASE_URL}/api/v1/milestones`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(milestoneData),
            },
          );

          if (!response.ok) {
            alert("Failed to create milestone");
          }

          const data = await response.json();
          console.log("✅ Milestone created successfully:", data);
          return { data };
        } catch (error: any) {
          console.error("❌ Error creating milestone:", error);
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
    }),

    getDepartments: build.query<Department[], void>({
      queryFn: async () => {
        try {
          console.log(`🔍 Fetching departments ...`);

          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            console.warn("⚠️ No user found in localStorage.");
            return { error: "User not authenticated" };
          }

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser?.token) {
            console.warn("⚠️ Invalid token.");
            return { error: "User not authenticated" };
          }

          const response = await fetch(
            `${BASE_URL}/api/v1/departments`,
            {
              headers: {
                Authorization: `Bearer ${parsedUser.token}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            alert("Failed to fetch project details");
          }

          const data = await response.json();
          console.log("✅ Successfully fetched project details:", data);
          return { data };
        } catch (error: any) {
          console.error("❌ Error fetching project details:", error);
          return { error: { status: "FETCH_ERROR", message: error.message } };
        }
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
  useCreateUserByAdminMutation,
  useGetProjectsByUserQuery,
  useGetRolesQuery,
  useUpdateUserMutation,
  useGetProjectMilestoneQuery,
  useGetProjectDetailsQuery,
  useCreateMilestoneMutation,
  useGetDepartmentsQuery
} = api;
