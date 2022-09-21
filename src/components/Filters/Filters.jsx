import React, {useEffect, useState} from 'react';
import moment from "moment";
import styles from './Filters.module.css'
import {useTranslation} from "react-i18next";
import classNames from "classnames";
import SelectMultiple from "../SelectMultiple/SelectMultiple";
import Select from '../Select/Select';
import DatePicker from "../DatePicker/DatePicker";
import {doGetPassportTypes} from "../../store/userActions";
import {useDispatch, useSelector} from "react-redux";
import {history} from "../../store/main";
import {getAllTypes} from "../../store/selectors";

export default function Filters(props) {
    let dispatch = useDispatch()
    let [date, setDate] = useState(null)
    let [overwork, setOverwork] = useState(false)
    let [requiredFix, setRequiredFix] = useState(false)
    let [deviceType, setDeviceType] = useState([''])
    let [passportType, setPassportType] = useState('production')
    let {t} = useTranslation()

    let passportTypes = useSelector(getAllTypes)

    useEffect(() => {
        props.onChange && props.onChange({deviceType, date, overwork, requiredFix, passportType})
    }, [date, overwork, requiredFix, deviceType, passportType])

    useEffect(() => {
        doGetPassportTypes(dispatch)
            .then((res) => {
            })
            .catch((err) => {
                if (err.response.status === 401)
                    history.push('/')
            })
    }, [])

    let dropFilters = () => {
        setDate(null)
        setOverwork(false)
        setRequiredFix(false)
        setDeviceType([''])
        props.onDrop && props.onDrop()
    }
    let selectOptions = [
        {name: "В производстве", value: 'production', state: true},
        {name: "Произведённые", value: 'built', state: false},
        {name: "На доработке", value: 'revision', state: false},
        {name: "Подтверждённые", value: 'approved', state: false},
        {name: "Выпущенные", value: 'finalized', state: false},
    ]
    return props.toggle === true ? (
        <div className={styles.contentWrapper}>
            <div className={styles.filtersWrapper}>
                <div className={styles.column}>
                    <div className={styles.filterName}>{t('filters.DeviceType')}</div>
                    <div className={styles.deviceTypeSelect}>
                        <SelectMultiple onChange={(e) => setDeviceType(e)} options={passportTypes}/>
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.filterName}>{t('filters.Date')}</div>
                    <DatePicker value={moment(date).format('yyyy-MM-DD')} onChange={(e) => setDate(e)}/>
                </div>
                <div className={styles.column}>
                    <div className={styles.filterName}>{t('filters.DeviceStatus')}</div>
                    <div className={styles.deviceTypeSelect}>
                        <Select options={selectOptions} onChange={(e) => setPassportType(e.value)}/>
                    </div>
                </div>
                <div className={classNames(styles.column, styles.fullWidthButton)}>
                    <div className={styles.dropButtonWrapper}>
                        <h2 onClick={dropFilters} className={styles.dropButton}>Сбросить</h2>
                    </div>
                </div>
            </div>
        </div>) : (<div/>);
}