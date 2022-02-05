import React, {useEffect, useState} from 'react';
import moment from "moment";
import styles from './Filters.module.css'
import {useTranslation} from "react-i18next";
import Checkbox from "../Checkbox/Checkbox";
import classNames from "classnames";
import Select from "../Select/Select";
import DatePicker from "../DatePicker/DatePicker";
import {doGetPassportTypes} from "../../store/userActions";
import {useDispatch, useSelector} from "react-redux";
import {history} from "../../store/main";
import {getAllTypes, getFiltersValues} from "../../store/selectors";
import {setFilters} from "../../store/filtersActions";

export default function Filters(props) {
    let dispatch = useDispatch()
    let filtersValues = useSelector(getFiltersValues)
    let [date, setDate] = useState(filtersValues.date)
    let [overwork, setOverwork] = useState(filtersValues.overwork)
    let [requiredFix, setRequiredFix] = useState(filtersValues.requiredFix)
    let [deviceType, setDeviceType] = useState(filtersValues.deviceType)
    let {t} = useTranslation()

    let passportTypes = useSelector(getAllTypes)

    useEffect(() => {
        props.onChange && props.onChange({deviceType, date, overwork, requiredFix})
        setFilters(dispatch, {
            date: date !== undefined ? date : null,
            deviceType: deviceType !== undefined ? deviceType: '',
            overwork: overwork !== undefined ? overwork : null,
            requiredFix: requiredFix !== undefined ? requiredFix : null
        })
    }, [date, overwork, requiredFix, deviceType])

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

    return props.toggle === true ? (
        <div className={styles.contentWrapper}>
            <div className={styles.filtersWrapper}>
                <div className={styles.column}>
                    <div className={styles.filterName}>{t('filters.DeviceType')}</div>
                    <div className={styles.deviceTypeSelect}>
                        <Select onChange={(e) => setDeviceType(e)} options={passportTypes}/>
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.filterName}>{t('filters.Date')}</div>
                    <DatePicker value={moment(date).format('yyyy-MM-DD')} onChange={(e) => setDate(e)}/>
                </div>
                <div className={classNames(styles.column, styles.minWidth450)}>
                    <Checkbox onChange={(status) => setOverwork(status)} checked={overwork}
                              type="time">{t('filters.Overwork')}</Checkbox>
                    <Checkbox onChange={(status) => setRequiredFix(status)} checked={requiredFix}
                              type="fix">{t('filters.NeedsFix')}</Checkbox>
                </div>
                <div className={classNames(styles.column, styles.fullWidthButton)}>
                    <div className={styles.dropButtonWrapper}>
                        <h2 onClick={dropFilters} className={styles.dropButton}>Сбросить</h2>
                    </div>
                </div>
            </div>
        </div>) : (<div/>);
}
