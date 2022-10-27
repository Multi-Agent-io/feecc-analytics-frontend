/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './SettingsButton.module.css';
import settings from '../../assets/settings.svg';

export default function SettingsButton({ onClick }) {
  return (
    <div className={styles.buttonWrapper}>
      <img onClick={() => onClick && onClick()} src={settings} alt="settings icon" />
    </div>
  );
}

SettingsButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
