import React from 'react';
import styles from './ScanButton.module.css'
import barcode from '../../assets/barcode.svg'
import { useContext } from "react";
import ModalActionsContext from '../../store/modal-context';


export default function ScanButton(props) {

    const { onOpen } = useContext(ModalActionsContext);

    return (
        <button onClick={onOpen} className={styles.buttonWrapper}>
            <img src={barcode}/>
        </button>
    );
}
