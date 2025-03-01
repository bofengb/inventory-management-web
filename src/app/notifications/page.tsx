"use client";

import React, { useState } from "react";
import Header from "@/app/(components)/Header";
import {
  useGetNotificationQuery,
  useToggleNotificationMutation,
} from "@/state/api";

function Notifications() {
  const { data: notifications, isLoading } = useGetNotificationQuery();
  const [toggleNotification] = useToggleNotificationMutation();

  // Sort notifications by createdAt in descending order (newest first)
  const sortedNotifications = notifications
    ? [...notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const handleToggle = async (id: number) => {
    try {
      // Toggle the notification's read status
      await toggleNotification(id).unwrap();
    } catch (error) {
      console.error("Failed to toggle notification:", error);
    }
  };

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div className="w-full">
      <Header name="Notifications" />
      <div className="overflow-x-auto mt-5 shadow-md">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="border-b-2 border-indigo-400">
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Message
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedNotifications.map((notification) => (
              <tr key={notification.id} className="hover:bg-blue-50">
                <td className="py-2 px-4">{notification.message}</td>
                <td className="py-2 px-4">
                  {notification.read ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                      Read
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
                      Unread
                    </span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleToggle(notification.id)}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    Mark as {notification.read ? "Unread" : "Read"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notifications;
