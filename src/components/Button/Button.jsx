import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

export default function Button({
  onClick, hidden, disabled, variant, children,
}) {
  const onClickHandler = (e) => {
    if (onClick !== undefined) {
      onClick(e);
    }
  };
  return (
    <button
      type="button"
      hidden={hidden}
      disabled={disabled}
      onClick={onClickHandler}
      className={clsx({
        [styles.defaultButton]: variant === 'default' || variant === undefined,
        [styles.clearButton]: variant === 'clear',
        [styles.disabled]: disabled,
      })}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(['default', 'clear']).isRequired,
  children: PropTypes.element.isRequired,
};
