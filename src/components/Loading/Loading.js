import React from 'react';
import styles from './Loading.module.css'

function Loading(props) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.loadingContainer}>
        <div className={styles.item}></div>
        <div className={styles.item}></div>
        <div className={styles.item}></div>
        <div className={styles.item}></div>
      </div>
    </div>
  );
}

export default Loading;