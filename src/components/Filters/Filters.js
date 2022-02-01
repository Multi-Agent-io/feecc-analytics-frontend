import React, {useEffect, useState} from 'react';
import styles from './Filters.module.css'
import {useTranslation} from "react-i18next";
import Checkbox from "../Checkbox/Checkbox";
import classNames from "classnames";
import Select from "../Select/Select";
import DatePicker from "../DatePicker/DatePicker";

export default function Filters(props) {
    let [date, setDate] = useState(null)
    let [overwork, setOverwork] = useState(false)
    let [requiredFix, setRequiredFix] = useState(false)
    let [deviceType, setDeviceType] = useState([''])

    let {t} = useTranslation()
    let options = [
        {id: 0, name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.', value: "Type1", state: false},
        {id: 1, name: 'Type 2', value: "Type2", state: false},
        {id: 2, name: 'Type 3', value: "Type3", state: false},
    ]

    useEffect(() => {
            props.onChange && props.onChange({deviceType, date, overwork, requiredFix})
    }, [date, overwork, requiredFix, deviceType])

    let dropFilters = () => {
        setDate(null)
        setOverwork(false)
        setRequiredFix(false)
        setDeviceType([''])
        props.onDrop && props.onDrop()
    }

    return (
        <div className={styles.contentWrapper}>
            <div className={styles.filtersWrapper}>
                <div className={styles.column}>
                    <div className={styles.filterName}>{t('filters.DeviceType')}</div>
                    <div className={styles.deviceTypeSelect}>
                        <Select onChange={(e) => setDeviceType(e)} options={options}/>
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.filterName}>{t('filters.Date')}</div>
                    <DatePicker onChange={(e) => setDate(e)}/>
                </div>
                <div className={classNames(styles.column, styles.minWidth450)}>
                    <Checkbox onChange={(status) => setOverwork(status)} checked={overwork} type="time">{t('filters.Overwork')}</Checkbox>
                    <Checkbox onChange={(status) => setRequiredFix(status)} checked={requiredFix} type="fix">{t('filters.NeedsFix')}</Checkbox>
                </div>
                <div className={classNames(styles.column, styles.fullWidthButton) }>
                    <div className={styles.dropButtonWrapper}>
                        <h2 onClick={dropFilters} className={styles.dropButton}>Сбросить</h2>
                    </div>
                </div>
            </div>
        </div>

    );
}