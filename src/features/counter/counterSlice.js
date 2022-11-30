import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  counters: { 1: 0 },
  tabs: {
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
      state.tabs = {
        ...state.tabs,
        single: [...state.tabs.single, action.payload.id.toString()],
        [action.payload.tab]: [
          ...state.tabs[action.payload.tab],
          action.payload.id.toString(),
        ],
      };
    },
    removeCounter: (state, action) => {
      state.counters = Object.keys(state.counters)
        .filter((counter) => counter !== action.payload.id)
        .reduce((obj, cur) => ({ ...obj, [cur]: state.counters[cur] }), {});
      state.tabs = {
        ...state.tabs,
        single: state.tabs.single.filter((id) => id !== action.payload.id),
        [action.payload.tab]: state.tabs[action.payload.tab].filter(
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
      state.tabs = {
        single: state.tabs.single,
        one: state.tabs.single.filter((id) => id % 2 !== 0),
        two: state.tabs.single.filter((id) => id % 2 === 0),
      };
    },
    setInitState: (state, action) => {
      state.counters = action.payload.state.counters;
      state.tabs = action.payload.state.tabs;
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
  setInitState,
} = counterSlice.actions;

export const selectCounters = (state) => state.counter.counters;

export const selectTabs = (state) => state.counter.tabs;

export const selectFirstFreeId = createSelector(selectCounters, (counters) =>
  Object.keys(counters).length === 0
    ? 1
    : Math.max(...Object.keys(counters)) + 1
);

export default counterSlice.reducer;
