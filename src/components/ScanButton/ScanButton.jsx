import React, { useContext } from 'react';
import styles from './ScanButton.module.css';
import barcode from '../../assets/barcode.svg';
import ModalActionsContext from '../../store/modal-context';

export default function ScanButton() {
  const { onOpenBar } = useContext(ModalActionsContext);

  return (
    <button type="button" onClick={onOpenBar} className={styles.buttonWrapper}>
      <img src={barcode} alt="barcode button" />
    </button>
  );
}
