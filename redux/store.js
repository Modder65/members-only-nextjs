import { configureStore } from "@reduxjs/toolkit";
import likesReducer from "./features/likesSlice";

export const store = configureStore({
  reducer: {
    likes: likesReducer,
  },
});


