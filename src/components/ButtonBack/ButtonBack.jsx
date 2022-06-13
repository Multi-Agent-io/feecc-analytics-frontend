import React from 'react';
import arrowLeft from '../../assets/arrrow_left.svg';
import { history } from '../../store/main';

import styles from './ButtonBack.module.css';

function ButtonBack() {
  return (
    <button
      type="button"
      onClick={() => history.goBack()}
      className={`${styles['btn-back']}`}
    >
      <img src={arrowLeft} alt="back button icon" />
    </button>
  );
}

export default ButtonBack;
