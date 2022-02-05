import React, {useEffect, useReducer, useState} from 'react';
import clsx from "clsx";
import styles from './Select.module.css'
import Checkbox from "../Checkbox/Checkbox";
import arrowDownIcon from '../../assets/arrow_down.svg'

export default function Select(props) {

    let reducer = (state, action) => {
        switch (action.type) {
            case 'updateCheckbox':
                const newState = state.checkboxes.map((item, index) => {
                    if(index !== action.id)
                        return item
                    return {...item, state: !item.state}
                })
                return {...state, checkboxes: [...newState]}
            case 'reset': {
                props.onChange && props.onChange('')
                return init(props.options)
            }
            default:
                return state
        }
    }
    let init = (initialState) => {
        return {checkboxes: [...initialState]}
    }
    let [state, localDispatch] = useReducer(reducer, props.options, init)

    let [selectStatus, toggleSelect] = useState(false)
    let [selectedElements, changeSelection] = useState('Выберите из списка')

    let updateCheckbox = (id) => {
        localDispatch({type: 'updateCheckbox', id: id})
        let arr = []
        state.checkboxes.forEach((item) => {
            if (item.state === true)
                arr.push(item.name)
        })
        if(state.checkboxes[id].state === true)
            arr.splice(arr.indexOf(state.checkboxes[id].name),1)
        else
            arr.push(state.checkboxes[id].name)
        let res = ''
        arr.forEach((item, index) => {
            res += item
            if(index !== arr.length - 1)
                res += ', '
        })
        props.onChange && props.onChange(res)
        if(res.length > 26)
            res = res.slice(0, 26) + '...'
        if(res !== '')
            changeSelection(res)
        else
            changeSelection('Выберите из списка')

    }

    let resetSelection = () => {
        changeSelection('Выберите из списка')
        localDispatch({type: 'reset'})
    }

    useEffect(() => {
        localDispatch({type: 'reset'})
    }, [props.options])

    return (
        <div className={clsx(styles.selectWrapper, {[styles.selectWrapperActive]: selectStatus})}>
            <ul className={styles.contentWrapper}>
                <div
                    onClick={() => toggleSelect(!selectStatus)}
                    className={clsx(styles.selectedContent, {[styles.selectedContentActive]: selectStatus})}>
                    <div className={styles.selectedContentText}>{selectedElements}</div>
                    <img className={clsx({[styles.rotatedArrow]: selectStatus})} src={arrowDownIcon} alt="Down arrow icon"/>
                </div>
                <div className={clsx(styles.checkboxesWrapper, {[styles.hidden]: !selectStatus})}>
                    <div className={styles.dropButtonWrapper}>
                        <h2 onClick={resetSelection} className={styles.dropButton}>Снять все выделения</h2>
                    </div>
                    {state.checkboxes.map((item, index) => {
                        return (
                            <div key={index}>
                                <Checkbox checked={item.state} onChange={() => updateCheckbox(index)} variant="small" >{item.name}</Checkbox>
                            </div>
                        )
                    })}
                </div>

            </ul>
        </div>
    );
}
