import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constant/config";

const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
  try {
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      `${server}/admin/verify`,
      { secretKey },
      config
    );
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
  try {
    const config = {
      withCredentials: true,
    };

    const { data } = await axios.get(`${server}/admin/`, config);
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

const adminLogout = createAsyncThunk("admin/logout", async () => {
  try {
    const config = {
      withCredentials: true,
    };

    const { data } = await axios.get(`${server}/admin/logout`, config);
    return data;
  } catch (error) {
    throw error.response.data.message;
  }
});

export { adminLogin, getAdmin,adminLogout };

