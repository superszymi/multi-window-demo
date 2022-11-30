import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

const syncMiddleware = (store) => (next) => (action) => {
  const { type, payload } = action;
  if (
    (payload && payload.synced === true) ||
    type === "counters/setInitState"
  ) {
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
