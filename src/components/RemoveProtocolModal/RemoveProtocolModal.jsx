import React, { useContext } from 'react';

// eslint-disable-next-line import/no-cycle
import { Modal, Button } from '..';
import { history } from '../../store/main';
import ModalActionsContext from '../../store/modal-context';

import classes from './RemoveProtocolModal.module.css';

import { doRemoveProtocol } from '../../store/userActions';

function RemoveProtocolModal() {
  const { modalDeleteStatus, onClose } = useContext(ModalActionsContext);

  const pushToServerHandler = () => {
    const internalId = window.location.pathname.split('/')[3];
    doRemoveProtocol(internalId);
    onClose();
    history.push('/tcd');
  };

  return (
    modalDeleteStatus && (
      <Modal>
        <section className={classes.contentUl}>
          <h1>Удалить протокол?</h1>
          <div className={classes['btn-section']}>
            <Button onClick={onClose}>Отмена</Button>
            <Button variant="delete" onClick={pushToServerHandler}>
              Удалить
            </Button>
          </div>
        </section>
      </Modal>
    )
  );
}

export default RemoveProtocolModal;
