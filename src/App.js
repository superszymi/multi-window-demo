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

  const onAddCounter = useCallback(() => {
    dispatch(addCounter(nextId));
  }, [dispatch, nextId]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => dispatch(decrement())}>-</button>
        <button onClick={onAddCounter}>Add counter</button>
        <button onClick={() => dispatch(increment())}>+</button>
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
