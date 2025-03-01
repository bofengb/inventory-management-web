"use client";

import { useGetCustomersQuery } from "@/state/api";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useAppSelector } from "../redux";
import { createTheme, styled, ThemeProvider } from "@mui/material";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 210 },
  { field: "createdAt", headerName: "Join Time", width: 220 },
];


const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff',
    color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  },
  '& .MuiDataGrid-cell': {
    borderColor: theme.palette.mode === 'dark' ? '#555' : '#e0e0e0',
  },
}));

const Customers = () => {
  const { data: customers, isError, isLoading } = useGetCustomersQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

   // Optionally, you can create a theme here too
   const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !customers) {
    return (
      <div className="text-center text-red-500 py-4">Failed to fetch customers</div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
    <div className="flex flex-col">
      <Header name="Users" />
      <StyledDataGrid
        rows={customers}
        columns={columns}
        getRowId={(row) => row.id}
        // checkboxSelection
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

export default Customers;