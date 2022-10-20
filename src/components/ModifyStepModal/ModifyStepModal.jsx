import React from 'react';
import styles from './ModifyStepModal.module.css';
import { Input, Button, TransitionModal } from '..';

export default function ModifyStepModal(props) {
  return (
    <TransitionModal open={props.open} handleClose={props.closeModal}>
      <h2>Изменить этап</h2>
      <div className={styles.modalContent}>
        <div className={styles.stepHeader}>Тип:</div>
        <div className={styles.stepContent}>{props.type}</div>
        <div className={styles.stepContentUpdate}>
          <Input />
        </div>

        <div className={styles.stepHeader}>Место:</div>
        <div className={styles.stepContent}>{props.workplace}</div>
        <div className={styles.stepContentUpdate}>
          <Input />
        </div>

        <div className={styles.stepHeader}>Имя:</div>
        <div className={styles.stepContent}>{props.name}</div>
        <div className={styles.stepContentUpdate}>
          <Input
          //   value={name} onChange={setName}
          />
        </div>

        <div className={styles.stepHeader}>Описание:</div>
        <div className={styles.stepContent}>{props.description}</div>
        <div className={styles.stepContentUpdate}>
          <Input
          //   value={description} onChange={setDescription}
          />
        </div>
      </div>
      <div className={styles.modalControls}>
        <Button
          onClick={() => {
            console.log(props);
            // console.log("Name:", name);
            // console.log("Description:", description);
          }}
        >
          Сохранить
        </Button>
        <Button warning onClick={props.closeModal}>
          Отменить
        </Button>
      </div>
    </TransitionModal>
  );
}
