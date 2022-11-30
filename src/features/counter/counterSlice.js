import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  counters: [1],
  status: "idle",
  count: 0,
};

export const counterSlice = createSlice({
  name: "counters",
  initialState,
  reducers: {
    addCounter: (state, action) => {
      state.counters = [...state.counters, action.payload.id];
    },
    removeCounter: (state, action) => {
      state.counters = state.counters.filter(
        (counter) => counter !== action.payload.id
      );
    },
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

export const { addCounter, removeCounter, increment, decrement } =
  counterSlice.actions;

export const selectCount = (state) => state.counter.count;

export const selectCounters = (state) => state.counter.counters;

export const selectFirstFreeId = createSelector(selectCounters, (counters) =>
  counters.length === 0 ? 1 : Math.max(...counters) + 1
);

export default counterSlice.reducer;
