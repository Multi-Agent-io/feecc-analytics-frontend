import React from 'react';
import clsx from "clsx";
import styles from './Button.module.css'

export default function Button(props) {

    let onClickHandler = (e) => {
        props.onClick && props.onClick(e)
    }

    return (
        
            <button hidden={props.hidden} disabled={props.disabled} onClick={onClickHandler} className={clsx({
                [styles.defaultButton]: props.variant === 'default' || props.variant === undefined,
                [styles.clearButton]: props.variant === 'clear',
                [styles.disabled]: props.disabled
            })}>{props.children}</button>
        
    );
}
