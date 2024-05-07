import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { adminLogin, adminLogout, getAdmin } from "../thunks/admin";

const initialState = {
  user: false,
  isAdmin: false,
  loader: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isAdmin = true;
        toast.success(action.payload.message);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isAdmin = false;
        toast.error(action.error.message);
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        if (action.payload.data.admin) {
          state.isAdmin = true;
        }
        else{
          state.isAdmin = false;
        }
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.isAdmin = false;
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
          state.isAdmin = false;
          toast.success(action.payload.message);
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.isAdmin = true;
      });
  },
});

export default authSlice;
export const { userExists, userNotExists } = authSlice.actions;
