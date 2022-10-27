import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Checkbox.module.css';
import timeIcon from '../../assets/time_icon.svg';
import fixIcon from '../../assets/fix_icon.svg';

export default function Checkbox({
  onChange, variant, checked, children, type,
}) {
  const onChangeHandler = (e) => {
    if (onChange !== undefined) onChange(e.target.value);
  };

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
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
  variant: PropTypes.oneOf(['small', undefined]).isRequired,
  checked: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['time', 'fix', undefined]).isRequired,
  children: PropTypes.element.isRequired,
};
