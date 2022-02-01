import React from 'react';
import styles from './Input.module.css'
import clsx from "clsx";

export default function Input(props) {

    let onChangeHandler = (e) => {
        props.onChange && props.onChange(e.target.value)
    }
    let onKeyDownHandler = (e) => {
        props.onKeyDown && props.onKeyDown(e.key)
    }

    return (
        <div className={styles.inputWrapper}>
            <input
                onKeyDown={onKeyDownHandler}
                onChange={onChangeHandler}
                className={clsx(styles.mainInput, {[styles.error]: props.error})}
                placeholder={props.placeholder}
                type={props.type !== undefined ? props.type : "text"}
            />
            <div className={styles.errorMessage}>{props.error}</div>
        </div>

    );
}
