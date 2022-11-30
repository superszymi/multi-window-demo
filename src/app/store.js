import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

const syncMiddleware = (store) => (next) => (action) => {
  const { payload } = action;
  if (payload && payload.synced === true) {
    return next(action);
  }
  const bc = new BroadcastChannel("state-sync");
  bc.postMessage(action);
  return;
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  middleware: [syncMiddleware],
});
