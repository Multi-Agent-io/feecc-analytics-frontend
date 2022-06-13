import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Button.module.css';

export default function Button({
  onClick, hidden, disabled, variant, clear, deleted, warning, children,
}) {
  const onClickHandler = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      hidden={hidden}
      disabled={disabled}
      onClick={onClickHandler}
      className={clsx({
        [styles.defaultButton]: variant === 'default' || variant === undefined,
        [styles.clearButton]: clear,
        [styles.deleteButton]: deleted,
        [styles.warningButton]: warning,
        [styles.disabled]: disabled,
      })}
      type="button"
    >
      {children}
    </button>

  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  variant: PropTypes.oneOf(['default', undefined]).isRequired,
  clear: PropTypes.bool.isRequired,
  deleted: PropTypes.bool.isRequired,
  warning: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};
