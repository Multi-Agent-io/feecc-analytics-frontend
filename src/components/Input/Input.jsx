import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Input.module.css';

export default function Input({
  onChange, placeholder, error, type, onKeyDown,
}) {
  const onChangeHandler = (e) => {
    if (onChange !== undefined) onChange(e.target.value);
  };
  const onKeyDownHandler = (({ key }) => {
    if (onKeyDown) onKeyDown(key);
  });

  return (
    <div className={styles.inputWrapper}>
      <input
        onKeyDown={onKeyDownHandler}
        onChange={onChangeHandler}
        className={clsx(styles.mainInput, { [styles.error]: error })}
        placeholder={placeholder}
        type={type !== undefined ? type : 'text'}
      />
      <div className={styles.errorMessage}>{error}</div>
    </div>

  );
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  type: PropTypes.oneOf([undefined, 'text', 'password']).isRequired,
};
