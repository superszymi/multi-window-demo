import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  counters: { 1: 0 },
  windows: {
    single: ["1"],
    one: [],
    two: [],
  },
};

export const counterSlice = createSlice({
  name: "counters",
  initialState,
  reducers: {
    addCounter: (state, action) => {
      state.counters = { ...state.counters, [action.payload.id]: 0 };
      state.windows = {
        ...state.windows,
        single: [...state.windows.single, action.payload.id.toString()],
        [action.payload.window]: [
          ...state.windows[action.payload.window],
          action.payload.id.toString(),
        ],
      };
    },
    removeCounter: (state, action) => {
      state.counters = Object.keys(state.counters)
        .filter((counter) => counter !== action.payload.id)
        .reduce((obj, cur) => ({ ...obj, [cur]: state.counters[cur] }), {});
      state.windows = {
        ...state.windows,
        single: state.windows.single.filter((id) => id !== action.payload.id),
        [action.payload.window]: state.windows[action.payload.window].filter(
          (id) => id !== action.payload.id
        ),
      };
    },
    increment: (state, action) => {
      state.counters = {
        ...state.counters,
        [action.payload.id]: state.counters[action.payload.id] + 1,
      };
    },
    decrement: (state, action) => {
      state.counters = {
        ...state.counters,
        [action.payload.id]: state.counters[action.payload.id] - 1,
      };
    },
    incrementAll: (state) => {
      state.counters = Object.keys(state.counters).reduce(
        (obj, cur) => ({ ...obj, [cur]: state.counters[cur] + 1 }),
        {}
      );
    },
    decrementAll: (state) => {
      state.counters = Object.keys(state.counters).reduce(
        (obj, cur) => ({ ...obj, [cur]: state.counters[cur] - 1 }),
        {}
      );
    },
    spreadCounters: (state) => {
      state.windows = {
        single: state.windows.single,
        one: state.windows.single.filter((id) => id % 2 !== 0),
        two: state.windows.single.filter((id) => id % 2 === 0),
      };
    },
    moveToWindow: (state, action) => {
      state.windows = {
        single: state.windows.single,
        [action.payload.sourceWindow]: state.windows[
          action.payload.sourceWindow
        ].filter((id) => id !== action.payload.id),
        [action.payload.targetWindow]: [
          ...state.windows[action.payload.targetWindow],
          action.payload.id,
        ],
      };
    },
    setInitState: (state, action) => {
      state.counters = action.payload.state.counters;
      state.windows = action.payload.state.windows;
    },
  },
});

export const {
  addCounter,
  removeCounter,
  increment,
  decrement,
  incrementAll,
  decrementAll,
  spreadCounters,
  moveToWindow,
  setInitState,
} = counterSlice.actions;

export const selectCounters = (state) => state.counter.counters;

export const selectWindows = (state) => state.counter.windows;

export const selectFirstFreeId = createSelector(selectCounters, (counters) =>
  Object.keys(counters).length === 0
    ? 1
    : Math.max(...Object.keys(counters)) + 1
);

export default counterSlice.reducer;
