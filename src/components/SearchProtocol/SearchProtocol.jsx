/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import arrowDown from '../../assets/arrrow_left.svg';
import classes from './SearchProtocol.module.css';

function SearchProtocol({
  types, label, onChange, value,
}) {
  const [optionsArray, header] = [types, label];

  return (
    <div className={classes.container}>
      <h2>{header}</h2>
      <select
        defaultValue={value}
        value={value}
        className={classes.select}
        onChange={onChange}
      >
        <option disabled>Выберите из списка</option>
        {optionsArray.map((type, index) => (<option key={index}>{type}</option>))}
      </select>
      <img id="arrow-select" alt="Arrow icon" className={classes.arrow} src={arrowDown} />
    </div>
  );
}

export default SearchProtocol;

SearchProtocol.propTypes = {
  types: PropTypes.arrayOf({}).isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
