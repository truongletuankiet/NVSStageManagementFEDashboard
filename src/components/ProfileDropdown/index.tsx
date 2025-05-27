import { LogOut, Moon, Settings, Sun, User, Book, Store } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";
import Image from "next/image";
import { User as UserInterface } from "@/state/api";

const ProfileDropdown = ({ user }: { user: UserInterface }) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {user.pictureProfile ? (
          <Image
            src={user.pictureProfile}
            alt={user.fullName}
            width={40}
            height={40}
            className="rounded-full border border-gray-300 dark:border-gray-600 object-cover shadow-md"
          />
        ) : (
          <User className="h-8 w-8 dark:text-white" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl dark:bg-gray-900"
          >
            {/* Profile Header */}
            <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3">
              {user.pictureProfile ? (
                <Image
                  src={user.pictureProfile}
                  alt={user.fullName}
                  width={36}
                  height={36}
                  className="rounded-full object-cover border border-gray-300 dark:border-gray-600 shadow-sm"
                />
              ) : (
                <User className="h-8 w-8 dark:text-white" />
              )}
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Dark Mode Switch */}
              <button
                onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span>Dark Mode</span>
              </button>

              {/* Menu Options */}
              {/* <button className="flex w-full items-center gap-3 rounded-lg p-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <Store className="h-5 w-5" />
                <span>Your Shop</span>
              </button> */}

              <button className="flex w-full items-center gap-3 rounded-lg p-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <Book className="h-5 w-5" />
                <span>Documentation</span>
              </button>

              <button className="flex w-full items-center gap-3 rounded-lg p-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>

              {/* Log Out */}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg p-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
