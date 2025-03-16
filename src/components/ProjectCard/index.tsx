import { Project } from "@/state/api";
import React from "react";
import { CalendarDays, MoreHorizontal } from "lucide-react";

const backgroundImages = [
  "https://www.operacolorado.org/wp-content/uploads/2021/05/OC_Figaro_Staver_445-scaled.jpg",
  "https://static01.nyt.com/images/2017/09/12/insider/CROSSWORDS-opera-cover/CROSSWORDS-opera-cover-superJumbo.jpg",
  "https://vietthuong.vn/upload/content/images/tu-van/2023/thang1-2023/5-ban-song-ca-opera-lang-man-nhat-moi-thoi-dai.jpg",
  "https://i.ex-cdn.com/vntravellive.com/files/news/2020/10/01/opera-margravial--mot-tuyet-tac-baroque-165346.jpg",
  "https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/11/24/20/yvonne-kenny.jpg",
];

const dummyMembers = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/women/46.jpg",
  "https://randomuser.me/api/portraits/men/47.jpg",
];

const getRandomProgress = () => Math.floor(Math.random() * 100);

const ProjectCard = ({ project }: { project: Project }) => {
  const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  const progress = getRandomProgress();

  return (
    <div className="relative w-80 rounded-lg bg-[#1E1F36] shadow-lg overflow-hidden p-4">
      {/* Background Image */}
      <div className="relative w-full h-32 rounded-lg overflow-hidden">
        <img src={randomImage} alt="Project" className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-white p-1 rounded-full shadow">
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>

        {/* Created Date */}
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <CalendarDays className="h-4 w-4 text-blue-500" />
          <span className="ml-2">Created: {project.startTime}</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-medium text-gray-400">
            <span>Tasks</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1 h-2 w-full bg-gray-700 rounded-full">
            <div
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Members */}
        <div className="mt-4 flex items-center">
          {dummyMembers.slice(0, 3).map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt="Member"
              className="h-8 w-8 rounded-full border-2 border-[#1E1F36] -ml-2 first:ml-0"
            />
          ))}
          {dummyMembers.length > 3 && (
            <span className="ml-2 text-sm text-gray-400">+{dummyMembers.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
