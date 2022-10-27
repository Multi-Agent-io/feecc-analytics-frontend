import React from 'react';
import PropTypes from 'prop-types';
import styles from './ModifyStepModal.module.css';
// eslint-disable-next-line import/no-cycle
import { Input, Button, TransitionModal } from '..';

export default function ModifyStepModal({
  open, type, workplace, name, description, closeModal,
}) {
  return (
    <TransitionModal open={open} handleClose={closeModal}>
      <h2>Изменить этап</h2>
      <div className={styles.modalContent}>
        <div className={styles.stepHeader}>Тип:</div>
        <div className={styles.stepContent}>{type}</div>
        <div className={styles.stepContentUpdate}>
          <Input />
        </div>

        <div className={styles.stepHeader}>Место:</div>
        <div className={styles.stepContent}>{workplace}</div>
        <div className={styles.stepContentUpdate}>
          <Input />
        </div>

        <div className={styles.stepHeader}>Имя:</div>
        <div className={styles.stepContent}>{name}</div>
        <div className={styles.stepContentUpdate}>
          <Input />
        </div>

        <div className={styles.stepHeader}>Описание:</div>
        <div className={styles.stepContent}>{description}</div>
        <div className={styles.stepContentUpdate}>
          <Input />
        </div>
      </div>
      <div className={styles.modalControls}>
        <Button
          onClick={() => {
            // console.log(props);
            // console.log("Name:", name);
            // console.log("Description:", description);
          }}
        >
          Сохранить
        </Button>
        <Button warning onClick={closeModal}>
          Отменить
        </Button>
      </div>
    </TransitionModal>
  );
}

ModifyStepModal.propTypes = {
  open: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  workplace: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
