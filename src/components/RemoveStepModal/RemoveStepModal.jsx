import React from 'react';
import styles from './RemoveStepModal.module.css';
import { Button, TransitionModal } from '..';

export default function RemoveStepModal(props) {
  return (
    <TransitionModal open={props.open} handleClose={props.closeModal}>
      <h2>
        Вы собираетесь удалить этап {props.index + 1} из сборки. Это действие
        необратимо!
      </h2>
      <div className={styles.modalContent}>
        <div className={styles.stepHeader}>Имя удаляемого этапа:</div>
        <div className={styles.stepContent}>{props.name}</div>
        <div className={styles.stepHeader}>Описание удаляемого этапа:</div>
        <div className={styles.stepContent}>{props.description}</div>
      </div>

      <div className={styles.modalControls}>
        <Button delete onClick={props.removeStep}>
          Удалить
        </Button>
        <Button onClick={props.closeModal}>Отменить</Button>
      </div>
    </TransitionModal>
  );
}
