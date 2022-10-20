import React from 'react';
import styles from './SettingsButton.module.css'
import settings from '../../assets/settings.svg'

export default function SettingsButton(props) {
    return (
        <div className={styles.buttonWrapper}>
            <img onClick={() => props.onClick && props.onClick()} src={settings} alt="settings icon"/>
        </div>
    );
}

