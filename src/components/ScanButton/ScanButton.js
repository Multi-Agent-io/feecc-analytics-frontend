import React from 'react';
import styles from './ScanButton.module.css'
import barcode from '../../assets/barcode.svg'

export default function ScanButton(props) {
    return (
        <div className={styles.buttonWrapper}>
            <img src={barcode}/>
        </div>
    );
}
