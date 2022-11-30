import React, { useCallback, useEffect, useState } from "react";
import Counter from "./features/counter/Counter";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementAll,
  incrementAll,
  addCounter,
  selectCounters,
  selectFirstFreeId,
  setInitState,
  selectTabs,
  spreadCounters,
} from "./features/counter/counterSlice";
import { createAction } from "@reduxjs/toolkit";
import { store } from "./app/store";

function App() {
  const counters = useSelector(selectCounters);
  const nextId = useSelector(selectFirstFreeId);
  const dispatch = useDispatch();
  const tabs = useSelector(selectTabs);
  const [tab, setTab] = useState(
    new URLSearchParams(window.location.search).get("tab") || "single"
  );

  const onAddCounterClick = useCallback(() => {
    dispatch(addCounter({ id: nextId, tab }));
  }, [dispatch, nextId, tab]);

  const onOpenNewTabClick = () => {
    dispatch(spreadCounters());
    window.open(
      window.location.href + "?tab=two",
      "",
      "popup=true,noreferrer=true,left=1280,width=1280,address=yes"
    );
    setTab("one");
    window.history.pushState({}, "", window.location.href + "?tab=one");
  };

  const REQUEST_INIT_STATE = "request-init-state";
  const SEND_INIT_STATE = "send-init-state";

  useEffect(() => {
    const bc = new BroadcastChannel("state-sync");
    bc.postMessage({ type: REQUEST_INIT_STATE });
    return () => bc.close();
  }, []);

  useEffect(() => {
    const bc = new BroadcastChannel("state-sync");
    bc.addEventListener("message", (message) => {
      const { type, payload } = message.data;

      if (type === REQUEST_INIT_STATE) {
        bc.postMessage({ type: SEND_INIT_STATE, payload: store.getState() });
        return;
      }
      if (type === SEND_INIT_STATE) {
        dispatch(setInitState({ state: payload.counter }));
        return;
      }
      if (type === EXIT_MULTI_TAB) {
        window.history.pushState(
          {},
          "",
          window.location.origin + window.location.pathname
        );
        setTab("single");
      }

      if (payload && payload.synced === true) {
        return;
      }
      dispatch(createAction(type)({ ...payload, synced: true }));
    });
    return () => bc.close();
  }, [dispatch, setTab]);

  const EXIT_MULTI_TAB = "exit-multi-tab";
  useEffect(() => {
    const onBeforeUnload = () => {
      const bc = new BroadcastChannel("state-sync");
      bc.postMessage({ type: EXIT_MULTI_TAB });
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => dispatch(decrementAll())}>-</button>
        <button onClick={onAddCounterClick}>Add counter</button>
        <button onClick={() => dispatch(incrementAll())}>+</button>
        <button onClick={onOpenNewTabClick}>Open new tab</button>
      </header>
      <main className="App-main">
        {Object.entries(counters).map(
          ([id, value]) =>
            tabs[tab].includes(id) && <Counter key={id} id={id} value={value} />
        )}
      </main>
    </div>
  );
}

export default App;
