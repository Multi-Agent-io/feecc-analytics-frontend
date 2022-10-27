/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import styles from './Passport.module.css';
import { getAllEmployees, getCurrentPassport, getLocation } from '../../store/selectors';
import { decodeUser, doGetPassport } from '../../store/userActions';
import overworkIcon from '../../assets/time_icon.svg';
import removeIcon from '../../assets/remove.png';
import fixRequiredIcon from '../../assets/fix_icon.svg';
import Button from '../../components/Button/Button';

import ModalActionsContext from '../../store/modal-context';
import RevisionContext from '../../store/revision-context';

export default function Passport() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const location = useSelector(getLocation);
  const passport = useSelector(getCurrentPassport)?.toJS();
  const employees = useSelector(getAllEmployees)?.toJS();

  const editModeIsOn = location.split('/')[3] === 'edit';

  const { onOpenConfirm } = useContext(ModalActionsContext);
  const { changeRevision, canSendRevision } = useContext(RevisionContext);

  const [showModal, toggleModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    doGetPassport(dispatch, location.split('/')[2])
      .then((res) => {
        const currentPassport = res.passport;
        if (currentPassport.status === 'production') {
          // eslint-disable-next-line no-alert
          alert(
            'Данное изделие находиться в стадии разработки\nНекоторые данные могут отображаться некорректно!',
          );
        }
        currentPassport.biography.forEach((step) => {
          if (!step.employee_name) return;
          decodeUser(dispatch, step.employee_name)
            .then();
        });
        setIsLoading(true);
        return currentPassport;
      })
      .catch();
  }, []);

  const videoClose = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (!videoClose.current.contains(event.target)) toggleModal(false);
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  });

  const changeRevisionArrayHandler = (id, name, index, event) => {
    const currentBtn = event.target;
    currentBtn.classList.toggle(styles['checked-btn']);
    changeRevision(id, name, index);
  };

  const parseDate = (dateString) => {
    const [hours, min, sec] = dateString.split(' ')[1].split(':');
    const [day, month, year] = dateString.split(' ')[0].split('-');
    return {
      hours, min, sec, year, month, day,
    };
  };

  const formatTime = (step) => {
    const {
      hours: hoursS,
      min: minS,
      sec: secS,
      year: yearS,
      month: monthS,
      day: dayS,
    } = parseDate(step.session_start_time);

    const {
      hours: hoursE,
      min: minE,
      sec: secE,
      year: yearE,
      month: monthE,
      day: dayE,
    } = parseDate(step.session_end_time);

    const start = new Date(yearS, monthS, dayS, hoursS, minS, secS);
    const end = new Date(yearE, monthE, dayE, hoursE, minE, secE);

    if (step.session_start_time === null || step.session_end_time === null) {
      return 'Время не указано';
    }
    const diff = (end - start) / 1000;
    const hours = parseInt((diff / 3600).toFixed(0), 10);
    let hoursAdd = '';

    if (hours === 1) hoursAdd = 'час';
    else if (hours > 1 && hours < 5) hoursAdd = 'часа';
    else hoursAdd = 'часов';

    const minutes = parseInt(((diff / 60) % 60).toFixed(0), 10);
    let minutesAdd = '';

    if (minutes === 1) minutesAdd = 'минута';
    else if (minutes > 1 && minutes < 5) minutesAdd = 'минуты';
    else minutesAdd = 'минут';

    const seconds = parseInt((diff % 60).toFixed(0), 10);
    let secondsAdd = '';

    if (seconds === 1) secondsAdd = 'секунда';
    else if (seconds > 1 && seconds < 5) secondsAdd = 'секунды';
    else secondsAdd = 'секунд';

    let res = '';

    if (hours > 0) res += `${hours} ${hoursAdd} `;
    if (minutes > 0) res += `${minutes} ${minutesAdd} `;
    if (seconds > 0) res += `${seconds} ${secondsAdd}`;
    if (res === '') res += '0 секунд';
    return res;
  };

  const extractDate = (dateString) => {
    const dateArray = dateString.split(' ')[0].split('-');
    return `${dateArray[0]}.${dateArray[1]}.${dateArray[2].slice(2)}`;
  };

  return (
    isLoading && (
      <div className={styles.pageWrapper}>
        <div className={styles.passportHeaderWrapper}>
          {passport.type !== null && passport.type !== undefined && passport.type !== '' && (<h2>{passport.type}</h2>)}
          <div className={styles.passportNameWrapper}>
            <h1>{(passport.model !== null && passport.model !== '') ? passport.model : 'Без названия'}</h1>
            {/* <p>{revisionIds}</p> */}
            <div className={styles.icons}>
              <img className={clsx({ [styles.inactiveIcon]: !passport.overwork })} src={overworkIcon} alt="Overwork icon" />
              <img className={clsx({ [styles.inactiveIcon]: !passport.needFix })} src={fixRequiredIcon} alt="Fix required icon" />
            </div>
          </div>
          <h2 className={styles.passportUUId}>
            {passport.uuid}
            {' '}
            |
            {' '}
            {passport.internal_id}
          </h2>
          <h2>{`Cерийный номер: ${passport.serial_number ? passport.serial_number : 'не найдено'}`}</h2>
        </div>
        <div className={styles.passportMainContent}>
          {passport.biography !== null
            && passport.biography !== undefined
            && passport.biography.length > 0
            ? passport.biography.map((step, index) => (
              <div key={step.unit_name} className={styles.passportStepWrapper}>
                <div className={styles.stepContentWrapper}>
                  <h2>
                    {step.name}
                    {step.unit_name && (
                      <p>
                        относится к
                        <a href={`/passport/${step.parent_unit_internal_id}/${editModeIsOn ? 'edit' : 'view'}`}>{step.unit_name}</a>
                      </p>
                    )}
                  </h2>
                  <div className={styles.descriptionWrapper}>
                    <div className={styles.stepRowWrapper}>
                      <h3 className={styles.descriptionRowHeader}>Время начала:</h3>
                      {step.session_start_time?.split(' ')[1] ? (
                        <h3>{step.session_start_time?.split(' ')[1]}</h3>
                      ) : (
                        <h3>Не найдено</h3>
                      )}
                    </div>
                    <div className={styles.stepRowWrapper}>
                      <h3 className={styles.descriptionRowHeader}>Длительность:</h3>
                      {step.session_end_time ? <h3>{formatTime(step)}</h3> : <h3>Не найдено</h3>}
                    </div>
                    <div className={styles.stepRowWrapper}>
                      <h3 className={styles.descriptionRowHeader}>Исполнитель:</h3>
                      {employees[step.employee_name] ? (
                        <h3>{employees[step.employee_name]}</h3>
                      ) : (
                        <h3>Не найдено</h3>
                      )}
                    </div>
                    <div className={styles.stepRowWrapper}>
                      <h3 className={styles.descriptionRowHeader}>Дата завершения:</h3>
                      {step.session_end_time
                        ? <h3>{extractDate(step.session_end_time)}</h3> : <h3>Не найдено</h3>}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    clsx(styles.stepVideoPreview, { [styles.notFound]: step.video_hashes === null })
                  }
                  onClick={() => {
                    if (step.video_hashes !== null) {
                      setSelectedStep(step);
                      toggleModal(true);
                    }
                  }}
                >
                  <h2>{step.video_hashes !== null ? 'Превью видеозаписи' : 'Запись недоступна'}</h2>
                </div>
                {editModeIsOn
                  && (
                    <div className={styles.configurationButtonsWrapper}>
                      <Button
                        onClick={() => changeRevisionArrayHandler(step.id, step.name, index)}
                        variant={step.unit_name === null ? 'default' : 'clear'}
                        hidden={step.unit_name !== null}
                      >
                        Нужна доработка
                      </Button>
                    </div>
                  )}

              </div>
            )) : (
              <h1 className={styles.noRequiredInformation}>{t('passport.noRequiredInformation')}</h1>
            )}
          {editModeIsOn
            && !canSendRevision
            && <Button onClick={onOpenConfirm}>Отправить на добработку</Button>}
        </div>

        {showModal && (
          <div className={styles.modalWrapper}>
            <div
              ref={videoClose}
              className={styles.modalContent}
            >
              <img
                onClick={() => toggleModal(false)}
                className={styles.removeIcon}
                src={removeIcon}
                alt="remove icon"
              />
              {selectedStep.video_hashes !== null ? (
                <ReactPlayer
                  playing
                  width={1100}
                  height={630}
                  controls
                  url={`https://multiagent.mypinata.cloud/ipfs/${selectedStep.video_hashes[0]}`}
                />
              ) : (
                <div className={styles.cantFindVideo}>Невозможно найти видео</div>
              )}
              <div className={styles.videoDescription}>{selectedStep.name}</div>
            </div>
          </div>
        )}
      </div>
    )
  );
}
