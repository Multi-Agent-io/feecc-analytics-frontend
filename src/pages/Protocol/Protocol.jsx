/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import styles from './Protocol.module.css';

import { history } from '../../store/main';
import { getRule } from '../../store/selectors';

import { PrintButton, ButtonBack, Button } from '../../components';

import conf from '../../config.json';
import { doApproveProtocol } from '../../store/userActions';
import ModalActionsContext from '../../store/modal-context';

function Protocol() {
  const [protocol, setProtocol] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [protocolId, setProtocolId] = useState('');
  const [isSuperEngineer, setSuperEngineer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  const { onDeleteProtocol } = useContext(ModalActionsContext);

  const superEngineer = useSelector(getRule) === undefined;
  const internalId = history.location.pathname.split('/')[3];

  const { enqueueSnackbar } = useSnackbar();
  const addNotification = (message, variant) => enqueueSnackbar(message, { variant });

  // ======== all handlers ========
  const inputDataHandler = (event) => {
    window.onbeforeunload = () => true; // defense from user's reload

    const targetInput = event.target;
    const targetValue = targetInput.type === 'checkbox' ? targetInput.checked : targetInput.value;
    const [index, place] = targetInput.id.split(' ');

    const newState = JSON.parse(JSON.stringify(protocol));
    const rowsArray = newState.rows;

    rowsArray[index][place] = targetValue;

    setProtocol(newState);
  };

  const serialNumberHandler = (event) => {
    setSerialNumber(event.target.value);
  };

  const submitDataHandler = () => {
    const rowsArray = protocol.rows;

    let allFieldChecked = true;

    for (let i = 0; i < rowsArray.length - 1; i += 1) {
      if (rowsArray[i].checked === false) {
        allFieldChecked = false;
      }
    }

    if (!allFieldChecked) {
      // eslint-disable-next-line no-alert
      allFieldChecked = window.confirm('Внимание вы не проверили все поля! Вы хотите продолжить?'); // should be changed to a modal window
    }

    if (!serialNumber) {
      addNotification('Внимание вы не заполнили серийный номер!', 'warning');
    }

    if (allFieldChecked && serialNumber) {
      console.log(protocol);

      const serialBody = `serial_number=${serialNumber}`;
      fetch(
        `${conf.base_url}/api/v1/passports/${internalId}/serial?${serialBody}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      ).then((res) => {
        if (res.ok) {
          addNotification('Серийный номер отправлен!', 'info');
        } else {
          addNotification('Что-то пошло не так серийного номера!', 'error');
        }
      });

      fetch(`${conf.base_url}/api/v1/tcd/protocols/${internalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(protocol),
      })
        .then((res) => {
          if (res.ok) {
            addNotification('Протокол успешно отправлен!', 'success');
          } else {
            addNotification('Что-то пошло не так c отправкой протокола!', 'error');
          }
          if (res.status === 403) {
            addNotification(
              'У вас недостаточно прав для отправки протокола!',
              'error',
            );
          }
        })
        .then(() => {
          window.onbeforeunload = () => null;
          history.goBack();
        });
    }
  };

  const approveProtocol = () => {
    doApproveProtocol(protocolId)
      .then(() => addNotification('Протокол отправлен успешно', 'success'))
      .catch((error) => addNotification(`Ошибка при отправке протокола:\n${error}`, 'error'));
  };

  const goToPassportHandler = () => {
    history.push(`/passport/${protocolId}/edit`);
  };

  const checkAllHandler = () => {
    window.onbeforeunload = () => true; // defense from user's reload

    const allCheckBox = document.querySelectorAll('div > input[type=checkbox]');
    const newState = JSON.parse(JSON.stringify(protocol));

    const rowsArray = newState.rows;

    for (let i = 0; i < allCheckBox.length; i += 1) {
      allCheckBox[i].checked = true;

      const targetValue = allCheckBox[i].checked;
      const [row, place] = allCheckBox[i].id.split(' ');

      rowsArray[row][place] = targetValue;
    }
    setProtocol(newState);
  };

  const openIPFSLink = () => {
    window.open(`https://gateway.pinata.cloud/ipfs/${protocol.ipfs_cid}`);
  };

  const openTXNHashLink = () => {
    window.open(`https://robonomics.subscan.io/extrinsic/${protocol.txn_hash}`);
  };

  // ======== make function for render ========
  const makeButtonSection = () => (
    <div className={styles['btns-section']}>
      <Button clear onClick={goToPassportHandler}>
        Открыть паспорт
      </Button>
      <div>
        {!isSuperEngineer && protocol.status !== 'Протокол утверждён' && (
          <>
            <Button onClick={checkAllHandler}>Отметить всё</Button>
            <Button onClick={submitDataHandler}>Испытание пройдено</Button>
            {(protocol.status === 'Вторая стадия испытаний пройдена'
              || protocol.status === 'Первая стадия испытаний пройдена') && (
              <Button onClick={approveProtocol}>Завершить протокол</Button>
            )}
          </>
        )}
        {protocol.status === 'Протокол утверждён' && (
          <>
            {protocol.ipfs_cid && <Button onClick={openIPFSLink}>IPFS</Button>}
            {protocol.txn_hash && (
              <Button onClick={openTXNHashLink}>Datalog</Button>
            )}
            <Button delete onClick={onDeleteProtocol}>
              Удалить протокол
            </Button>
          </>
        )}
        {isSuperEngineer && <Button>Завершить протокол</Button>}
      </div>
    </div>
  );

  const makeGridTable = (arrayItems) => {
    const jsxArray = arrayItems.map((row, index) => {
      const {
        name = 'Без имени',
        value = '',
        deviation = '',
        test1 = '',
        test2 = '',
        checked = false,
      } = row;
      return (
        <>
          <div key={`${index} name`}>{name}</div>
          <div key={`${index} value`}>{value}</div>
          <div key={`${index} deviation`}>{deviation}</div>
          <input
            key={`${index} test1`}
            type="text"
            placeholder="Введите значение"
            id={`${index} test1`}
            value={test1}
            disabled={protocol.status === 'Протокол утверждён'}
          />
          <input
            key={`${index} test2`}
            type="text"
            placeholder="Введите значение"
            id={`${index} test2`}
            value={test2}
            disabled={protocol.status === 'Протокол утверждён'}
          />
          <div key={`${index} checked`}>
            <input
              defaultChecked={checked}
              type="checkbox"
              id={`${index} checked`}
              disabled={protocol.status === 'Протокол утверждён'}
            />
            <label htmlFor={`${index} checked`}> Проверено</label>
          </div>
        </>
      );
    });

    return (
      <div
        onChange={inputDataHandler}
        className={`${styles['grid-container_body']} ${styles.grid}`}
      >
        {jsxArray}
      </div>
    );
  };

  // ======== use effect ========
  useEffect(() => {
    setIsLoading(true); // start loading
    fetch(`${conf.base_url}/api/v1/tcd/protocols/${internalId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        if (res.detail !== 'Success') {
          addNotification('Error reading protocol. No schema for this product', 'error');
        } else {
          setProtocol(res.protocol);
          setProtocolId(internalId);
          setSuperEngineer(superEngineer);
          setSerialNumber(res.serial_number);
          setIsLoading(false);
        }
      });
    // clear event listener for defence from reloading (from checkAllHandler)
    // eslint-disable-next-line no-return-assign
    return () => (window.onbeforeunload = () => null);
  }, []);

  return isLoading ? (
    <h1 className={styles.loading}>Идёт загрузка...</h1>
  ) : (
    <section
      className={`${styles.section} ${
        isSuperEngineer === true ? styles['super-engineer'] : null
      }`}
    >
      <div className={styles.header}>
        <ButtonBack />
        <div>
          <h1>ПРОТОКОЛ приемо-сдаточных испытаний №__-В</h1>
          <h2 className={styles.protocol_name}>{protocol.protocol_name}</h2>
          <h2>
            SN:
            {' '}
            {protocol.default_serial_number !== null
              ? protocol.default_serial_number
              : '941619006-'}
            <input
              onChange={serialNumberHandler}
              value={serialNumber}
              className={styles.serial_number}
              placeholder="000000"
            />
          </h2>
        </div>
        <PrintButton disabled={isLoading} />
      </div>

      <div className={`${styles['grid-container_header']} ${styles.grid}`}>
        <div className={styles['col-1']}>
          Наименование параметра (показателя)
        </div>
        <div className={styles['col-2']}>Значение параметра</div>
        <div className={styles['col-3']}>Номинальное значение</div>
        <div className={styles['col-4']}>Предельное отклонение</div>
        <div className={styles['col-5']}>Первичное испытание</div>
        <div className={styles['col-6']}>Вторичное испытание</div>
        <div className={styles['col-check']}>Проверено</div>
      </div>

      {makeGridTable(protocol.rows)}

      {makeButtonSection()}
    </section>
  );
}

export default Protocol;
