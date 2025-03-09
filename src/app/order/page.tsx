"use client";

import { useGetOrderDetailsQuery } from "@/state/api";
import React from "react";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { createTheme, styled, ThemeProvider } from "@mui/material";
import { useAppSelector } from "../redux";

const columns: GridColDef[] = [
  { field: "orderId", headerName: "ID", width: 85 },
  {
    field: "totalAmount",
    headerName: "Amount",
    width: 120,
    type: "number",
    // For proper filtering, it’s best that the underlying value remains numeric.
    // Consider separating the display formatting from the filtering value.
    valueGetter: (value, row) => row.totalAmount,
    renderCell: (params) => `$${params.value}`,
  },
  { field: "status", headerName: "Order Status", width: 150 },
  { field: "productName", headerName: "Product Name", width: 175 },
  { field: "customerName", headerName: "Customer Name", width: 170 },
  { field: "paymentMethod", headerName: "Payment Method", width: 150 },
  {
    field: "createdAt",
    headerName: "Order Created Time",
    width: 200,
    type: "dateTime",
    // Ensure that the underlying value is a Date object for correct filtering.
    valueGetter: (value) => value && new Date(value),
  },
];

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#fff",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
  },
  "& .MuiDataGrid-cell": {
    borderColor: theme.palette.mode === "dark" ? "#555" : "#e0e0e0",
  },
}));

const Order = () => {
  const { data: orders, isError, isLoading } = useGetOrderDetailsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Create the theme here
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !orders) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch orders
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col">
        <Header name="Order" />
        <StyledDataGrid
          rows={orders}
          columns={columns}
          getRowId={(row) => row.orderId}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        />
      </div>
    </ThemeProvider>
  );
};

export default Order;
