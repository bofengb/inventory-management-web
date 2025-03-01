"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import {
  setIsDarkMode,
  setIsNotificationOn,
  setIsSidebarCollapsed,
} from "@/state";
import { useGetNotificationQuery } from "@/state/api";
import { Bell, BellOff, Menu, Moon, Settings, Sun } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  // Retrieve the dispatch function to dispatch actions to Redux.
  const dispatch = useAppDispatch();

  // Select the current sidebar state from the Redux store.
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isNotificationOn = useAppSelector(
    (state) => state.global.isNotificationOn
  );

  // This function toggles the sidebar's collapsed state by dispatching an action.
  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };
  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const { data: notifications, isLoading } = useGetNotificationQuery();
  // Filter notifications that are not read
  const unreadCount = notifications
    ? notifications.filter((n) => !n.read).length
    : 0;

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <div>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="cursor-pointer text-gray-500" size={24} />
              ) : (
                <Moon className="cursor-pointer text-gray-500" size={24} />
              )}
            </button>
          </div>

          {!isNotificationOn ? (
            <div className="relative">
              <Link href="/notifications">
                <Bell className="cursor-pointer text-gray-500" size={24} />

                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            <div className="relative">
              <BellOff className="cursor-pointer text-gray-500" size={24} />
            </div>
          )}
          <hr className="w-0 h-7 border-solid border-l border-gray-300 mx-3" />
        </div>
        <Link href="/settings">
          <Settings className="cursor-pointer text-gray-500" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
