import { Project } from "@/state/api";
import React from "react";
import { CalendarDays } from "lucide-react";

// Danh sách ảnh background
const backgroundImages = [
  "https://www.operacolorado.org/wp-content/uploads/2021/05/OC_Figaro_Staver_445-scaled.jpg",
  "https://static01.nyt.com/images/2017/09/12/insider/CROSSWORDS-opera-cover/CROSSWORDS-opera-cover-superJumbo.jpg",
  "https://vietthuong.vn/upload/content/images/tu-van/2023/thang1-2023/5-ban-song-ca-opera-lang-man-nhat-moi-thoi-dai.jpg",
  "https://i.ex-cdn.com/vntravellive.com/files/news/2020/10/01/opera-margravial--mot-tuyet-tac-baroque-165346.jpg",
  "https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/11/24/20/yvonne-kenny.jpg",
  "https://wings.com.vn/wp-content/uploads/2022/04/32.jpg",
  "https://hoinhacsi.vn/storage/2569/traviata_1600x900.jpg",
];

type Props = {
  project: Project;
};

const ProjectCard = ({ project }: Props) => {
  // Chọn ngẫu nhiên một ảnh từ danh sách
  const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-transparent bg-gradient-to-br from-blue-500 to-purple-500 p-1 shadow-lg transition-transform hover:scale-105">
      {/* Label góc trái trên */}
      <div className="absolute left-3 top-3 z-10 rounded-md bg-gradient-to-r from-red-500 to-orange-400 px-3 py-1 text-xs font-semibold text-white shadow-md">
        Featured
      </div>

      <div className="flex h-full flex-col rounded-2xl bg-white">
        {/* Background cho tiêu đề */}
        <div
          className="relative h-28 w-full bg-cover bg-center rounded-t-2xl"
          style={{ backgroundImage: `url('${randomImage}')` }}
        >
          {/* Overlay làm mờ nhẹ background */}
          <div className="absolute inset-0 bg-black/40 rounded-t-2xl" />

          {/* Project Name */}
          <h3 className="absolute bottom-2 left-4 text-lg font-bold text-white drop-shadow-lg">
            {project.title}
          </h3>
        </div>

        <div className="p-6">
          <p className="mt-2 text-gray-600">{project.description}</p>

          {/* Ngày bắt đầu và kết thúc */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              {project.startTime}
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-purple-600" />
              {project.endTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
