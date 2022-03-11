import React, {useEffect, useReducer, useState} from 'react';
import clsx from "clsx";
import styles from './Select.module.css'
import Checkbox from "../Checkbox/Checkbox";
import arrowDownIcon from '../../assets/arrow_down.svg'

export default function Select(props) {


    const [checkboxes, setCheckboxes] = useState([])
    let [selectStatus, toggleSelect] = useState(false)
    let [selectedElements, changeSelection] = useState('Выберите из списка')

    const resetSelection = () => {
        let arr = [...checkboxes]
        arr.map((item) => item.state = false)
        setCheckboxes(arr)
    }

    const updateCheckbox = (index) => {
        let arr = [...checkboxes]
        arr.map((item, innerIndex) => {
            if (index === innerIndex)
                item.state = !item.state
            return item
        })
        setCheckboxes(arr)
    }

    useEffect(() => {
        setCheckboxes(props.options)
    }, [])

    useEffect(() => {
        console.log(checkboxes)
    }, [checkboxes])

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
                    {checkboxes.map((item, index) => {
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
