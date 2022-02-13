import React, {useEffect, useState} from 'react';
import styles from './Passport.module.css'
import clsx from "clsx";
import {getAllEmployees, getCurrentPassport, getLocation} from "../../store/selectors";
import {useDispatch, useSelector} from "react-redux";
import {decodeUser, doGetPassport} from "../../store/userActions";
import overworkIcon from '../../assets/time_icon.svg'
import removeIcon from '../../assets/remove.png'
import fixRequiredIcon from '../../assets/fix_icon.svg'
import Button from "../../components/Button/Button";
import {useTranslation} from "react-i18next";
import ReactPlayer from "react-player";

export default function Passport(props) {

    let {t} = useTranslation()
    let dispatch = useDispatch()

    let location = useSelector(getLocation)
    let passport = useSelector(getCurrentPassport)?.toJS()
    let employees = useSelector(getAllEmployees)?.toJS()

    let [showModal, toggleModal] = useState(false)
    let [selectedStep, setSelectedStep] = useState({})
    const [revisionIds, setRevisionIds] = useState("")

    useEffect(() => {
        doGetPassport(dispatch, location.split('/')[2])
            .then((res) => {
                
                res.passport.biography.forEach((step, index) => {
                    decodeUser(dispatch, step.employee_name)
                        .then((res) => {
                        })
                })
            })
            .catch((error) => {})
    }, [])

    const changeRevisionArrayHandler = async (id) => {
        console.log(id);
        const internalId = location.split('/')[2];
        fetch(`/api/v1/passports/${internalId}/revision`,{
            body: []
        })
    }

    let reverseDate = (dateString) => {
        let d1 = dateString.split(' ')
        let d2 = d1[0].split('-')
        let temp = d2[1]
        d2[1] = d2[0]
        d2[0] = temp
        return `${d2[0]}-${d2[1]}-${d2[2]} ${d1[1]}`
    }

    let formatTime = (step) => {
        reverseDate(step.session_start_time)
        let start = Date.parse(reverseDate(step.session_start_time))
        let end = Date.parse(reverseDate(step.session_end_time))
        // console.log('start, end: ', start, end)
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
        if (res === '')
            res += '0 секунд'
        return res
    }
    let extractDate = (dateString) => {
        let dateArray = dateString.split(' ')[0].split('-')
        return `${dateArray[0]}.${dateArray[1]}.${dateArray[2].slice(2)}`
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
                <h2 className={styles.passportUUId}>{passport.uuid} | {passport.internal_id}</h2>
            </div>
            <div className={styles.passportMainContent}>
            {passport.biography !== null && passport.biography !== undefined && passport.biography.length > 0 ? passport.biography.map((step, index) => {
                    return (
                            <div key={index} className={styles.passportStepWrapper}>
                                <div className={styles.stepContentWrapper}>
                                    <h2>{step.name}{step.unit_name && <p>относится к <a href = {`/passport/${step.parent_unit_internal_id}`}>{step.unit_name}</a></p>}</h2>
                                    <div className={styles.descriptionWrapper}>
                                        <div className={styles.stepRowWrapper}>
                                            <h3 className={styles.descriptionRowHeader}>Время начала:</h3>
                                            <h3>{step.session_start_time?.split(' ')[1]}</h3>
                                        </div><div className={styles.stepRowWrapper}>
                                            <h3 className={styles.descriptionRowHeader}>Длительность:</h3>
                                            {step.session_end_time ? <h3>{formatTime(step)}</h3> : <h3>Не найдено</h3>}
                                        </div>
                                        <div className={styles.stepRowWrapper}>
                                            <h3 className={styles.descriptionRowHeader}>Исполнитель:</h3>
                                            <h3>{employees[step.employee_name]}</h3>
                                        </div>
                                        <div className={styles.stepRowWrapper}>
                                            <h3 className={styles.descriptionRowHeader}>Дата завершения:</h3>
                                            {step.session_end_time ? <h3>{extractDate(step.session_end_time)}</h3> : <h3>Не найдено</h3>}
                                        </div>
                                    </div>
                                </div>
                                <div className={clsx(styles.stepVideoPreview, {[styles.notFound]: step.video_hashes === null})}
                                     onClick={() => {
                                         if(step.video_hashes !== null) {
                                             setSelectedStep(step)
                                             toggleModal(true)
                                         }
                                     }}
                                >
                                    <h2>{step.video_hashes !== null ? "Превью видеозаписи" : "Запись недоступна"}</h2>
                                </div>
                                <div className={styles.configurationButtonsWrapper}>
                                    <Button 
                                        onClick = {changeRevisionArrayHandler.bind(null, step.id)}
                                        variant = {step.unit_name === null ? "default" : "clear"} 
                                        disabled = {step.unit_name === null ? false : true} 
                                    >
                                    Отправить на доработку
                                    </Button>
                                </div>
                            </div>
                    )}
            ) : (
                <h1 className={styles.noRequiredInformation}>{t('passport.noRequiredInformation')}</h1>
            )}
            </div>
            {showModal && (
                <div className={styles.modalWrapper}>
                    <div className={styles.modalContent}>
                        <img onClick={() => toggleModal(false)} className={styles.removeIcon} src={removeIcon} alt="remove icon"/>
                        {selectedStep.video_hashes !== null ? (
                            <ReactPlayer playing={true} width={1100} height={630} controls={true} url={`https://multiagent.mypinata.cloud/ipfs/${selectedStep.video_hashes[0]}`}/>
                        ) : (
                            <div className={styles.cantFindVideo}>Невозможно найти видео</div>
                        )}
                        <div className={styles.videoDescription}>{selectedStep.name}</div>
                    </div>
                </div>
            )}

        </div>
    );
}
