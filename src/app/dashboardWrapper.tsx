// "use client" tells Next.js that this component should be rendered on the client-side.
// This is necessary for components that use client-only features like state, effects, etc.
"use client";

import React, { useEffect } from "react";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

// DashboardLayout defines the common layout structure for the dashboard.
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // useAppSelector allows you to read data from the Redux store.
  // Here, we're extracting the `isSidebarCollapsed` and `isDarkMode` values from the global slice.
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // useEffect runs after the component renders.
  // It adds a CSS class to the document's root element (<html>) depending on the dark mode flag.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      // Optionally, you might want to remove the 'dark' class if it exists,
      // but here we simply add a 'light' class.
      document.documentElement.classList.add("light");
    }
  });

  return (
    <div
      className={`${
        isDarkMode ? "dark" : "light"
      } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
    
        <Navbar />
        {children}
      </main>
    </div>
  );
};

// DashboardWrapper wraps the DashboardLayout with the Redux StoreProvider.
// This ensures that the entire dashboard (layout + pages) has access to the Redux store.
const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
