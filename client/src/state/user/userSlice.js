import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.error = null;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.currentUser = null;
      state.error = action.payload;
      state.loading = false;
    },
    updateStart: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    updateSucces: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    deleteSuccuss: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = false;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSucces,
  updateFailure,
  deleteStart,
  deleteSuccuss,
  deleteFailure,
} = userSlice.actions;

export default userSlice.reducer;
