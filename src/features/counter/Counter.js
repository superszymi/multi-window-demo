import React from "react";
import { useDispatch } from "react-redux";
import { removeCounter, increment, decrement } from "./counterSlice";
import styles from "./Counter.module.css";

const Counter = ({ id, value }) => {
  const dispatch = useDispatch();
  const tab =
    new URLSearchParams(window.location.search).get("tab") || "single";

  const onRemove = () => {
    dispatch(removeCounter({ id, tab }));
  };

  return (
    <div>
      <div className={styles.counter}>
        <button className={styles.remove} onClick={onRemove}>
          x
        </button>
        <span className={styles.title}>{`Counter ${id}`}</span>
        <div className={styles.decrement}>
          <button onClick={() => dispatch(decrement({ id }))}>-</button>
        </div>
        <span className={styles.value}>{value}</span>
        <div className={styles.increment}>
          <button onClick={() => dispatch(increment({ id }))}>+</button>
        </div>
      </div>
    </div>
  );
};

export default Counter;
