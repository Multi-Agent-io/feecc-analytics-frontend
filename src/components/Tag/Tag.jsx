import React from 'react';
import PropTypes from 'prop-types';
import styles from './Tag.module.css';

function Tag({
  style, hover, shadow, children,
}) {
  return (
    <div
      className={`
      ${styles.tagWrapper}
      ${style === 'warning' && styles.warningTag}
      ${hover && styles.tagHover}
      ${shadow && styles.addShadow}
      `}
    >
      {children}
    </div>
  );
}

export default Tag;

Tag.propTypes = {
  style: PropTypes.oneOf(['warning', undefined]).isRequired,
  hover: PropTypes.bool.isRequired,
  shadow: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};
