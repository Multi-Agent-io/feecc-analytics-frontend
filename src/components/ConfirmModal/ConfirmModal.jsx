import React, { useContext, useEffect, useState } from 'react';
import Button from '../Button/Button';

import Modal from '../Modal/Modal';
import { history } from '../../store/main';

import ModalActionsContext from '../../store/modal-context';
import RevisionContext from '../../store/revision-context';

import classes from './ConfirmModal.module.css';

import conf from '../../config.json';
import useNotify from '../../hooks/useNotify';

function ConfirmModal() {
  const { modalConfirmStatus, onClose } = useContext(ModalActionsContext);
  const { revisionsItem } = useContext(RevisionContext);
  const [nameRevision, setNameRevision] = useState([]);
  const [idsRevision, setIdsRevision] = useState([]);
  const notify = useNotify();

  const pushToServerHandler = () => {
    const internalId = window.location.pathname.split('/')[2];
    const desiredArray = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const id of idsRevision) {
      if (id) desiredArray.push(id);
    }

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
        notify('Этапы отправлены на доработку', 'success');
        history.push('/tcd');
      });
  };

  useEffect(() => {
    // const tempRevisionsItem = { ...revisionsItem };
    setNameRevision(revisionsItem.filter((item) => Object.values(item)[0] || 'Имени нет'));
    setIdsRevision(revisionsItem.map((item) => Object.keys(item)[0] || 'Имени нет'));
  }, [revisionsItem]);

  if (modalConfirmStatus) {
    return (
      <Modal>
        <section className={classes.contentUl}>
          <h1>Выбранные стадии на доработку:</h1>
          <ol>
            {nameRevision.map((item) => (item ? <li key={item.name}>{item}</li> : null))}
          </ol>
          <div className={classes['btn-section']}>
            <Button onClick={onClose}>Отмена</Button>
            <Button variant="clear" onClick={pushToServerHandler}>Отправить на доработку</Button>
          </div>
        </section>
      </Modal>
    );
  }

  return (<div />);
}

export default ConfirmModal;
