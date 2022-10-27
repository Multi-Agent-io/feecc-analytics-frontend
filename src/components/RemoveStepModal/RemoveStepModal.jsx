import React from 'react';
import PropTypes from 'prop-types';
import styles from './RemoveStepModal.module.css';
// eslint-disable-next-line import/no-cycle
import { Button, TransitionModal } from '..';

export default function RemoveStepModal({
  open, closeModal, index, name, description, removeStep,
}) {
  return (
    <TransitionModal open={open} handleClose={closeModal}>
      <h2>
        Вы собираетесь удалить этап
        {' '}
        {index + 1}
        {' '}
        из сборки. Это действие
        необратимо!
      </h2>
      <div className={styles.modalContent}>
        <div className={styles.stepHeader}>Имя удаляемого этапа:</div>
        <div className={styles.stepContent}>{name}</div>
        <div className={styles.stepHeader}>Описание удаляемого этапа:</div>
        <div className={styles.stepContent}>{description}</div>
      </div>

      <div className={styles.modalControls}>
        <Button delete onClick={removeStep}>
          Удалить
        </Button>
        <Button onClick={closeModal}>Отменить</Button>
      </div>
    </TransitionModal>
  );
}

RemoveStepModal.propTypes = {
  open: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  removeStep: PropTypes.func.isRequired,

  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
