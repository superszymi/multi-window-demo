import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeCounter, selectCount } from "./counterSlice";
import styles from "./Counter.module.css";

const Counter = ({ id }) => {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  const onRemove = () => {
    dispatch(removeCounter(id));
  };

  return (
    <div>
      <div className={styles.counter}>
        <button className={styles.remove} onClick={onRemove}>
          x
        </button>
        <span className={styles.title}>Counter {id}</span>
        <span className={styles.value}>{count}</span>
      </div>
    </div>
  );
};

export default Counter;
