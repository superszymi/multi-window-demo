import React, { useCallback, useEffect, useRef, useState } from "react";
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
  selectWindows,
  spreadCounters,
  moveToWindow,
} from "./features/counter/counterSlice";
import { createAction } from "@reduxjs/toolkit";
import { store } from "./app/store";

function App() {
  const counters = useSelector(selectCounters);
  const nextId = useSelector(selectFirstFreeId);
  const dispatch = useDispatch();
  const windows = useSelector(selectWindows);
  const [currentWindow, setCurrentWindow] = useState(
    new URLSearchParams(window.location.search).get("window") || "single"
  );
  const [itemOverDropzone, setItemOverDropzone] = useState(false);

  const ref = useRef(null);

  const onAddCounterClick = useCallback(() => {
    dispatch(addCounter({ id: nextId, window: currentWindow }));
  }, [dispatch, nextId, currentWindow]);

  const onOpenNewWindowClick = () => {
    dispatch(spreadCounters());
    window.open(
      window.location.href + "?window=two",
      "",
      "popup=true,noopener,left=720,width=720,address=yes"
    );
    setCurrentWindow("one");
    window.history.pushState({}, "", window.location.href + "?window=one");
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
      if (type === EXIT_MULTI_WINDOW) {
        window.history.pushState(
          {},
          "",
          window.location.origin + window.location.pathname
        );
        setCurrentWindow("single");
      }

      if (payload && payload.synced === true) {
        return;
      }
      dispatch(createAction(type)({ ...payload, synced: true }));
    });
    return () => bc.close();
  }, [dispatch, setCurrentWindow]);

  const EXIT_MULTI_WINDOW = "exit-multi-window";
  useEffect(() => {
    const onBeforeUnload = () => {
      const bc = new BroadcastChannel("state-sync");
      bc.postMessage({ type: EXIT_MULTI_WINDOW });
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const onCounterDrop = useCallback(
    (event) => {
      event.preventDefault();
      setItemOverDropzone(false);
      if (!currentWindow || currentWindow === "single") {
        return;
      }
      const id = event.dataTransfer.getData("text/plain");
      if (!windows[currentWindow].includes(id)) {
        dispatch(
          moveToWindow({
            id,
            targetWindow: currentWindow,
            sourceWindow: currentWindow === "one" ? "two" : "one",
          })
        );
      }
    },
    [dispatch, currentWindow, windows]
  );

  const onDragOver = (event) => {
    event.preventDefault();
  };
  const onDragEnter = () => {
    setItemOverDropzone(true);
  };
  const onDragLeave = () => {
    setItemOverDropzone(false);
  };

  useEffect(() => {
    const dropzone = ref.current;
    dropzone.addEventListener("drop", (event) => onCounterDrop(event));
    dropzone.addEventListener("dragover", (event) => onDragOver(event));
    dropzone.addEventListener("dragenter", () => onDragEnter());
    dropzone.addEventListener("dragleave", () => onDragLeave());
    return () => {
      dropzone.removeEventListener("drop", onCounterDrop);
      dropzone.removeEventListener("dragover", onDragOver);
      dropzone.removeEventListener("dragenter", onDragEnter);
      dropzone.removeEventListener("dragleave", onDragLeave);
    };
  }, [dispatch, onCounterDrop, currentWindow, windows]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => dispatch(decrementAll())}>-</button>
        <button onClick={onAddCounterClick}>Add counter</button>
        <button onClick={() => dispatch(incrementAll())}>+</button>
        <button onClick={onOpenNewWindowClick}>Open new window</button>
      </header>
      <main
        className={`App-main ${itemOverDropzone ? "dragover" : ""}`}
        ref={ref}
      >
        {Object.entries(counters).map(
          ([id, value]) =>
            windows[currentWindow].includes(id) && (
              <Counter key={id} id={id} value={value} />
            )
        )}
        {itemOverDropzone && (
          <div className="dragover-text">Drop counter here</div>
        )}
      </main>
    </div>
  );
}

export default App;
