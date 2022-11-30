import React, { useCallback } from "react";
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

function App() {
  const counters = useSelector(selectCounters);
  const nextId = useSelector(selectFirstFreeId);
  const dispatch = useDispatch();

  const onAddCounterClick = useCallback(() => {
    dispatch(addCounter(nextId));
  }, [dispatch, nextId]);

  const onOpenNewTabClick = () => {
    window.open(
      window.location.href,
      "",
      "popup=true,noreferrer=true,left=1280,width=1280"
    );
  };

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
