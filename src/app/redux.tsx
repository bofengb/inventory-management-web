// Import React hook for creating a persistent reference (used for the store instance)
import { useRef } from "react";
// Redux Toolkit utilities for combining reducers and configuring the store
import { combineReducers, configureStore } from "@reduxjs/toolkit";
// React-Redux hooks and provider to connect React with Redux
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
// Import global state slice reducer
import globalReducer from "@/state";
// Import RTK Query API slice which handles API calls
import { api } from "@/state/api";
// Enable refetching on focus/refetch behaviors provided by RTK Query.
import { setupListeners } from "@reduxjs/toolkit/query";

// Imports from redux-persist to enable state persistence in storage (e.g., localStorage)
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// PersistGate delays the rendering of UI until the persisted state is rehydrated
import { PersistGate } from "redux-persist/integration/react";
// Utility to create a storage instance (here, for localStorage)
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/* ============================== */
/*       REDUX PERSISTENCE        */
/* ============================== */

// Create a dummy storage that does nothing. This is used for server-side rendering because localStorage is not available on the server.
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

// Decide which storage to use based on the environment
const storage =
  typeof window === "undefined"
    ? createNoopStorage() // For server-side: use the dummy storage
    : createWebStorage("local"); // For client-side: use localStorage

// Define the configuration for redux-persist
const persistConfig = {
  key: "root", // The key in storage under which the persisted data is saved
  storage, // The storage engine chosen above (localStorage or dummy)
  whitelist: ["global"], // Only persist the 'global' slice of state
};

// Combine the app's reducers into a single root reducer.
// This includes the global state and the RTK Query API slice.
const rootReducer = combineReducers({
  global: globalReducer, // Global state slice
  [api.reducerPath]: api.reducer, // RTK Query API slice, integrated using its reducerPath
});

// Enhance the root reducer to support persistence based on the configuration above
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ============================== */
/*         REDUX STORE            */
/* ============================== */

// Function to create the Redux store using Redux Toolkit's configureStore method
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer, // Use the persisted reducer to handle state and rehydration
    middleware: (getDefaultMiddleware) =>
      // Customize middleware to ignore non-serializable values in redux-persist actions.
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        // Add RTK Query middleware to handle API caching, fetching, etc.
        .concat(api.middleware),
  });
};

/* ============================== */
/*        REDUX TYPES             */
/* ============================== */

// TypeScript type definitions for store, state, and dispatch function
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Custom hooks for dispatching actions and selecting state with proper TypeScript types
// A custom hook (often a typed version of Redux's useSelector) that selects a part of the Redux state.
export const useAppDispatch = () => useDispatch<AppDispatch>();
// A custom hook (typed version of Redux's useDispatch) that provides the dispatch function for triggering state changes.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* ============================== */
/*          PROVIDER              */
/* ============================== */

// Provider component that wraps the app with Redux and persistence capabilities
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useRef ensures that the store is created only once, even if the component re-renders.
  // This is especially important in Next.js (SSR) to avoid creating a new store on every render.
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Setup RTK Query listeners for features like refetchOnFocus and refetchOnReconnect.
    setupListeners(storeRef.current.dispatch);
  }

  // Create a persistor which will handle the rehydration of the store state from storage.
  const persistor = persistStore(storeRef.current);

  // Provide the Redux store to the rest of the app.
  // PersistGate delays the UI rendering until the persisted state is retrieved and loaded.
  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
