import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  token: null,
  name: null,
  email: null,
  role: null,
  img: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.img = action.payload.img;
      state.isAuthenticated = true;
    },
    userLogout: (state) => {
      state.user = null;
      state.token = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
    setTokenExpired: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { userLogin, userLogout,setTokenExpired } = authSlice.actions;
export default authSlice.reducer;
