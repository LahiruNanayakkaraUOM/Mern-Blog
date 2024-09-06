import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTheme: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.activeTheme = state.activeTheme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
