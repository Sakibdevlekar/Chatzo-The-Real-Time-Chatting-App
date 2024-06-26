import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth.reducer.js";
import api from "./api/api.js";
import miscSlice from "./reducers/misc.js";
import chatSlice from "./reducers/chat.js";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [miscSlice.name]: miscSlice.reducer,
    [chatSlice.name]: chatSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (middleware) => [...middleware(), api.middleware],
});

export default store;
