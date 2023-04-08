import React from 'react';
import clsx from "clsx";
import './button.scoped.css'

export default function Button(props) {

    let onClickHandler = (e) => {
        props.onClick && props.onClick(e)
    }

    return (
        
            <button hidden={props.hidden} disabled={props.disabled} onClick={onClickHandler} className={clsx({
                ['defaultButton']: props.variant === 'default' || props.variant === undefined,
                ['clearButton']: props.variant === 'clear',
                ['disabled']: props.disabled,
                ['primary']: props.primary,
                [`size-${props.size}`]: props.size,
            })}>{props.children}</button>
        
    );
}
