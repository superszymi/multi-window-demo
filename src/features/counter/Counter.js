import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { removeCounter, increment, decrement } from "./counterSlice";
import styles from "./Counter.module.css";

const Counter = ({ id, value }) => {
  const dispatch = useDispatch();
  const currentWindow =
    new URLSearchParams(window.location.search).get("window") || "single";
  const ref = useRef(null);

  const onRemove = () => {
    dispatch(removeCounter({ id, window: currentWindow }));
  };

  const onDragStart = useCallback(
    (event) => {
      event.dataTransfer.setData("text/plain", id);
    },
    [id]
  );

  useEffect(() => {
    const draggable = ref.current;
    draggable.addEventListener("dragstart", (event) => onDragStart(event));
    return () => draggable.removeEventListener("dragstart", onDragStart);
  }, [onDragStart, currentWindow]);

  return (
    <div>
      <div className={styles.counter} ref={ref} draggable="true">
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
