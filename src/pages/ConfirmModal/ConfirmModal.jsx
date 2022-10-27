/* eslint-disable no-restricted-syntax */
import React, { useContext, useEffect, useState } from 'react';
import Button from '../../components/Button/Button';

import Modal from '../../components/Modal/Modal';
import { history } from '../../store/main';

import ModalActionsContext from '../../store/modal-context';
import RevisionContext from '../../store/revision-context';

// eslint-disable-next-line import/no-unresolved
import classes from './ConfirmModal.module.css';

import conf from '../../config.json';

function ConfirmModal() {
  const { modalConfirmStatus, onClose } = useContext(ModalActionsContext);
  const { revisionsItem } = useContext(RevisionContext);
  const [nameRevision, setNameRevision] = useState([]);
  const [idsRevision, setIdsRevision] = useState([]);

  const pushToServerHandler = () => {
    const internalId = window.location.pathname.split('/')[2];
    const desiredArray = [];
    for (const id of idsRevision) {
      if (id) {
        desiredArray.push(id);
      }
    }
    // console.log(internalId);
    // console.log(desiredArray);

    const url = `${conf.base_url}/api/v1/passports/${internalId}/revision`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(desiredArray),
    })
      .then(() => {
        onClose();
        history.push('/tcd');
      });
  };

  useEffect(() => {
    setNameRevision(
      revisionsItem.map((item) => {
        // if (item) {
        const name = Object.values(item)[0];
        return name || 'Имени нет';
        // }
      }),
    );
    setIdsRevision(
      revisionsItem.map((item) => {
        // if (item) {
        const name = Object.keys(item)[0];
        return name || 'Имени нет';
        // }
      }),
    );
  }, [revisionsItem]);

  return (modalConfirmStatus && (
    <Modal>
      <section className={classes.contentUl}>
        <h1>Выбранные стадии на доработку:</h1>
        <ol>
          {nameRevision.map((item) => (item ? <li key={item}>{item}</li> : null))}
        </ol>
        <div className={classes['btn-section']}>
          <Button onClick={onClose}>Отмена</Button>
          <Button variant="clear" onClick={pushToServerHandler}>Отправить на доработку</Button>
        </div>
      </section>
    </Modal>
  ));
}

export default ConfirmModal;
