import React, {useEffect, useState} from 'react';
import styles from './Passport.module.css'
import moment from "moment";
import clsx from "clsx";
import {getAllEmployees, getCurrentPassport, getLocation} from "../../store/selectors";
import {useDispatch, useSelector} from "react-redux";
import {decodeUser, doGetPassport} from "../../store/userActions";
import overworkIcon from '../../assets/time_icon.svg'
import fixRequiredIcon from '../../assets/fix_icon.svg'
import Button from "../../components/Button/Button";
import {useTranslation} from "react-i18next";

export default function Passport(props) {

    let {t} = useTranslation()
    let dispatch = useDispatch()

    let location = useSelector(getLocation)
    let passport = useSelector(getCurrentPassport)?.toJS()
    let employees = useSelector(getAllEmployees)?.toJS()

    // let [usernames, setUsernames] = useState([])

    useEffect(() => {
        doGetPassport(dispatch, location.split('/')[2])
            .then((res) => {
                // console.log(res)
                // setUsernames([''])
                res.passport.biography.forEach((step, index) => {
                    decodeUser(dispatch, step.employee_name)
                        .then((res) => {
                            // if(res.employee !== null) {
                            //     let arr = usernames
                            //     arr[index] = res.employee.name
                            //     setUsernames(arr)
                            // }
                            // else {
                            //     console.log('setting user to not found')
                            //     let arr = usernames
                            //     arr[index] = 'Сотрудник не найден'
                            //     setUsernames(arr)
                            // }
                            // console.log('biography step', index)
                            // console.log('usernames')
                            // console.log(usernames)
                    })
                })
                // setTimeout(() => {
                //     console.log('employees')
                //     console.log(employees)
                // }, 2000)
            })
            .catch((error) => {})
    }, [])

    let formatTime = (step) => {
        const start = Date.parse(step.session_start_time)
        const end = Date.parse(step.session_end_time)
        if (step.session_start_time === null || step.session_end_time === null)
            return "Время не указано"
        const diff = (end - start)/1000
        let hours = parseInt((diff/3600).toFixed(0))
        let hoursAdd = ''
        if (hours === 1)
            hoursAdd = 'час'
        else if (hours > 1 && hours < 5)
            hoursAdd = 'часа'
        else
            hoursAdd = 'часов'
        let minutes = parseInt((diff/60%60).toFixed(0))
        let minutesAdd = ''
        if (minutes === 1)
            minutesAdd = 'минута'
        else if (minutes > 1 && minutes < 5)
            minutesAdd = 'минуты'
        else
            minutesAdd = 'минут'
        let seconds = parseInt((diff%60).toFixed(0))
        let secondsAdd = ''
        if (seconds === 1)
            secondsAdd = 'секунда'
        else if (seconds > 1 && seconds < 5)
            secondsAdd = 'секунды'
        else
            secondsAdd = 'секунд'
        let res = ''
        if (hours > 0)
            res += hours + ' ' + hoursAdd + ' '
        if (minutes > 0)
            res += minutes + ' ' + minutesAdd + ' '
        if (seconds > 0)
            res += seconds + ' ' + secondsAdd
        return res
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.passportHeaderWrapper}>
                {passport.type !== null && passport.type !== undefined && passport.type !== '' && (<h2>{passport.type}</h2>)}
                <div className={styles.passportNameWrapper}>
                    <h1>{(passport.model !== null && passport.model !== '') ? passport.model : 'Без названия'}</h1>
                    <div className={styles.icons}>
                        <img className={clsx({[styles.inactiveIcon]: !passport.overwork})} src={overworkIcon} alt="Overwork icon"/>
                        <img className={clsx({[styles.inactiveIcon]: !passport.needFix})} src={fixRequiredIcon} alt="Fix required icon"/>
                    </div>
                </div>
                <h2 className={styles.passportUUId}>{passport.uuid}</h2>
            </div>
            <div className={styles.passportMainContent}>
            {passport.biography !== null && passport.biography !== undefined && passport.biography.length > 0 ? passport.biography.map((step, index) => {
                    return (
                            <div className={styles.passportStepWrapper}>
                                <div className={styles.stepContentWrapper}>
                                    <h2>{step.name}</h2>
                                    <div className={styles.descriptionWrapper}>
                                        <div className={styles.stepRowWrapper}>
                                            <h3 className={styles.descriptionRowHeader}>Длительность:</h3>
                                            <h3>{formatTime(step)}</h3>
                                        </div>
                                        <div className={styles.stepRowWrapper}>
                                            <h3 className={styles.descriptionRowHeader}>Исполнитель:</h3>
                                            <h3>{employees[step.employee_name]}</h3>
                                        </div>
                                        <div className={styles.stepRowWrapper}>
                                            <h3 className={styles.descriptionRowHeader}>Дата завершения:</h3>
                                            <h3>{moment(Date.parse(step.session_end_time)).format('DD.MM.YY')}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.stepVideoPreview}>
                                    <h2>Превью видеозаписи</h2>
                                </div>
                                <div className={styles.configurationButtonsWrapper}>
                                    <Button variant="clear" disabled={true}>Отправить на доработку</Button>
                                </div>
                            </div>
                    )}
            ) : (
                <h1 className={styles.noRequiredInformation}>{t('passport.noRequiredInformation')}</h1>
            )}
            </div>
        </div>
    );
}
