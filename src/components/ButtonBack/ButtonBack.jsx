import React from 'react';
import PropTypes from 'prop-types';
import arrowLeft from '../../assets/arrrow_left.svg';
import { history } from '../../store/main';
import styles from './ButtonBack.module.css';

function ButtonBack({ classes }) {
  return (
    <button
      type="button"
      onClick={() => history.goBack()}
      className={`${styles['btn-back']} ${classes}`}
    >
      <img src={arrowLeft} alt="arrowLeft" />
    </button>
  );
}

ButtonBack.propTypes = {
  classes: PropTypes.string,
};

ButtonBack.defaultProps = {
  classes: '',
};

export default ButtonBack;
