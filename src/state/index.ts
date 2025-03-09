// Import functions from Redux Toolkit that help create slices of state and type actions.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  isNotificationOn: boolean;
}

const initialState: InitialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  isNotificationOn: true,
};

// Create a "slice" of the Redux state using createSlice.
// A slice bundles the state definition, action creators, and reducers into one.
export const globalSlice = createSlice({
  name: "global", // Name of the slice; used in action types and as a key in the Redux state.
  initialState, // Set the initial state defined above.
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      // Update the state directly (thanks to Immer, which handles immutable updates behind the scenes).
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setIsNotificationOn: (state, action: PayloadAction<boolean>) => {
      state.isNotificationOn = action.payload;
    },
  },
});

// Export the action creators generated by createSlice.
// These are functions we'll use to dispatch actions that update the global state.
export const { setIsSidebarCollapsed, setIsDarkMode, setIsNotificationOn } =
  globalSlice.actions;

// Export the reducer generated by createSlice.
// This reducer will be used in the Redux store to handle changes to the global state.
export default globalSlice.reducer;
