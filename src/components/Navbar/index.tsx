import React, { useState } from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import Image from "next/image";
import Modal from "../Modal";
import ProfileDropdown from "../ProfileDropdown";
import { motion, AnimatePresence } from "framer-motion"; // Import animation

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: currentUser } = useGetAuthUserQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentUser) return null;

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/"; // Chuyển hướng về trang login
  };

  return (
    <>
      {/* Navbar */}
      <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black shadow-md transition-all">
        {/* Search Bar */}
        <div className="flex items-center gap-8">
          {isSidebarCollapsed && (
            <button
              onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
              className="hover:scale-105 transition-all"
            >
              <Menu className="h-8 w-8 dark:text-white" />
            </button>
          )}
          <div className="relative flex h-min w-[200px]">
            <Search className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 transform dark:text-white" />
            <input
              className="w-full rounded-lg bg-gray-100 p-2 pl-8 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
              type="search"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Icons & User Info */}
        <div className="flex items-center">
          <button
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6 dark:text-white" />
            ) : (
              <Moon className="h-6 w-6 dark:text-white" />
            )}
          </button>
          {/* <Link href="/settings" className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
            <Settings className="h-6 w-6 dark:text-white" />
          </Link> */}
          <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>

          {/* User Profile */}
          <div className="hidden md:flex items-center">
            {/* <div className="flex h-9 w-9 justify-center">
              {currentUser?.pictureProfile ? (
                <Image
                  src={"https://yt3.googleusercontent.com/VyVearlaIaJ9uD1ikXSores0pvd8UQUMM82sRPAe4M5NiwfQAoppC9Wn0-58oVFPqCbBGTiQ5A=s900-c-k-c0x00ffffff-no-rj"}
                  alt={currentUser.fullName || "User Profile"}
                  width={36}
                  height={36}
                  className="h-full rounded-full object-cover shadow-md"
                />
              ) : (
                <User className="h-6 w-6 dark:text-white" />
              )}
            </div>
            <span className="mx-3 text-gray-800 dark:text-white font-semibold">
              {currentUser.fullName}
            </span> */}
            
            {/* <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div> */}

            {/* User Profile Dropdown */}
            <ProfileDropdown user={currentUser} />

            <motion.button
              className="hidden rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all md:block"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign out
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal Xác Nhận Đăng Xuất */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} name="Confirm Sign Out">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="p-4 text-center"
            >
              <p className="text-lg text-gray-800 dark:text-white font-medium">
                Are you sure you want to sign out?
              </p>
              <div className="mt-4 flex justify-center gap-4">
                <motion.button
                  className="rounded bg-gray-400 px-4 py-2 text-xs font-bold text-white hover:bg-gray-500 transition-all"
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="rounded bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition-all"
                  onClick={handleSignOut}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes, Sign Out
                </motion.button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
