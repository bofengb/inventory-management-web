"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/(components)/Header";
import { useAppDispatch, useAppSelector } from "../redux";
import { setIsDarkMode, setIsNotificationOn } from "@/state";
import { Toaster, toast } from "sonner";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "select" | "toggle";
};

const mockSettings: UserSetting[] = [
  { label: "Notification", value: true, type: "toggle" },
  { label: "Dark Mode", value: false, type: "toggle" },
  { label: "Language", value: "English", type: "select" },
];

const Settings = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isNotificationOn = useAppSelector(
    (state) => state.global.isNotificationOn
  );

  const [userSettings, setUserSettings] = useState<UserSetting[]>(mockSettings);

  const toggleDarkMode = (index: number) => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const toggleNotification = (index: number) => {
    dispatch(setIsNotificationOn(!isNotificationOn));
    const settingsCopy = [...userSettings];
    settingsCopy[index].value = !settingsCopy[index].value as boolean;
    setUserSettings(settingsCopy);
  };

  // Create a combined handler that checks the index
  const handleToggle = (index: number) => {
    if (index === 0) {
      toggleNotification(index);
    } else if (index === 1) {
      toggleDarkMode(index);
    }

    toast.success(
      `New settings saved`
    );
  };

  useEffect(() => {
    setUserSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.label === "Dark Mode"
          ? { ...setting, value: isDarkMode }
          : setting
      )
    );
  }, [isDarkMode]);

  return (
    <div className="w-full">
      {/* Render the Toaster component for Sonner toast notifications */}
      <Toaster richColors closeButton position="bottom-center" />
      <Header name="User Settings" />
      <div className="overflow-x-auto mt-5 shadow-md">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="border-b-2 border-indigo-400">
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {userSettings.map((setting, index) => (
              <tr className="hover:bg-blue-50" key={setting.label}>
                <td className="py-2 px-4">{setting.label}</td>
                <td className="py-2 px-4">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        // checked={setting.value as boolean}
                        checked={
                          setting.label === "Dark Mode"
                            ? isDarkMode
                            : (setting.value as boolean)
                        }
                        onChange={() => handleToggle(index)}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  ) : (
                    <select
                      id="status"
                      name="status"
                      className="mt-1 block w-1/2 pl-3 pr-10 py-2 text-base bg-background text-foreground border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      defaultValue="English"
                    >
                      <option>Select a language</option>
                      <option>English</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
