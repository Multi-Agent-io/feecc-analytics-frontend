/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Checkbox.module.css';
import timeIcon from '../../assets/time_icon.svg';
import fixIcon from '../../assets/fix_icon.svg';

export default function Checkbox({
  onChange, variant, children, type, checked,
}) {
  const onChangeHandler = (e) => {
    if (onChange !== undefined) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={clsx(styles.container, { [styles.smallContainer]: variant === 'small' })}>
      {children}
      <input checked={checked} onChange={onChangeHandler} type="checkbox" />
      <span className={clsx(styles.checkmark, { [styles.smallCheckmark]: variant === 'small' })} />
      {type === 'time' && (<img src={timeIcon} alt="time icon" />)}
      {type === 'fix' && (<img src={fixIcon} alt="fix icon" />)}
    </label>
  );
}

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
  children: PropTypes.element.isRequired,
  type: PropTypes.oneOf(['time', 'fix']).isRequired,
  checked: PropTypes.bool.isRequired,
};
