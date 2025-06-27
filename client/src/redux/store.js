import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./features/alertSlice";
import { userSlice } from "./features/userSlice";

export const store = configureStore({
  reducer: {
    alert: alertReducer, // ✅ this key MUST match useSelector
    user: userSlice.reducer,
  },
});
