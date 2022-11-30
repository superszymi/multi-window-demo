import React, { useCallback, useEffect } from "react";
import Counter from "./features/counter/Counter";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import {
  decrement,
  increment,
  addCounter,
  selectCounters,
  selectFirstFreeId,
} from "./features/counter/counterSlice";
import { createAction } from "@reduxjs/toolkit";

function App() {
  const counters = useSelector(selectCounters);
  const nextId = useSelector(selectFirstFreeId);
  const dispatch = useDispatch();

  const onAddCounterClick = useCallback(() => {
    dispatch(addCounter({ id: nextId }));
  }, [dispatch, nextId]);

  const onOpenNewTabClick = () => {
    window.open(
      window.location.href,
      "",
      "popup=true,noreferrer=true,left=1280,width=1280"
    );
  };

  useEffect(() => {
    const bc = new BroadcastChannel("state-sync");
    bc.addEventListener("message", (message) => {
      const { type, payload } = message.data;
      if (payload && payload.synced === true) {
        return;
      }
      dispatch(createAction(type)({ ...payload, synced: true }));
    });
    return () => bc.close();
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={onAddCounterClick}>Add counter</button>
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={onOpenNewTabClick}>Open new tab</button>
      </header>
      <main className="App-main">
        {counters.map((id) => (
          <Counter key={id} id={id} />
        ))}
      </main>
    </div>
  );
}

export default App;
