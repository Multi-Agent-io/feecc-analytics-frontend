import React, {useEffect} from 'react';
import clsx from "clsx";
import styles from './Checkbox.module.css'
import time_icon from '../../assets/time_icon.svg'
import fix_icon from '../../assets/fix_icon.svg'

export default function Checkbox(props) {


    let onChangeHandler = (e) => {
        props.onChange && props.onChange(e.target.checked)
    }

    // useEffect(() => {
    //     console.log('UPDATING checked to ', props.checked)
    // }, [props.checked])

    return (
        <label className={clsx(styles.container, {[styles.smallContainer]: props.variant === 'small'})}>
            {props.children}
            <input checked={props.checked} onChange={onChangeHandler} type="checkbox"/>
            <span className={clsx(styles.checkmark, {[styles.smallCheckmark]: props.variant === 'small'})}></span>
            {props.type === 'time' && (<img src={time_icon} alt="time icon"/>)}
            {props.type === 'fix' && (<img src={fix_icon} alt="fix icon"/>)}
        </label>
    );
}
