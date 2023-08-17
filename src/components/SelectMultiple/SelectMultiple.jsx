import React, {useEffect, useState} from 'react';
import clsx from "clsx";
import styles from './SelectMultiple.module.css'
import Checkbox from "../Checkbox/Checkbox";
import arrowDownIcon from '../../assets/arrow_down.svg'
import {useTranslation} from "react-i18next";

export default function SelectMultiple(props) {

    const [checkboxes, setCheckboxes] = useState([])
    let [selectStatus, toggleSelect] = useState(false)
    let [selectedElements, changeSelection] = useState('Выберите из списка')
    let {t} = useTranslation()

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
    }, [props.options])


  useEffect(() => {
    if(props.type.length === 1) {
        resetSelection()
    }
  }, [props.type])

    useEffect(() => {
        let res = ''
        checkboxes.filter((v) => v.state === true).forEach((item, index, arr) => {
            res += item.name
            if(index !== arr.length - 1)
                res += ','
        })
        if (res !== '') {
            let temp = res
            if(res.length > 26)
                temp = res.slice(0, 26) + "..."
            changeSelection(temp)
        } else {
            changeSelection(t('filters.ChooseFromList'))
        }
        props.onChange && props.onChange(res)
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
                        <h2 onClick={resetSelection} className={styles.dropButton}>{t('filters.selects.removeSelections')}</h2>
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
