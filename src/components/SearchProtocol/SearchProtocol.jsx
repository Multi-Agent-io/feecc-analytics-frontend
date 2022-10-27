import React from 'react';
import PropTypes from 'prop-types';
import arrowDown from '../../assets/arrrow_left.svg';

import classes from './SearchProtocol.module.css';

function SearchProtocol({
  label, value, onChange, types,
}) {
  return (
    <div className={classes.container}>
      <h2>{label}</h2>
      <select
        defaultValue={value}
        value={value}
        className={classes.select}
        onChange={onChange}
      >
        <option disabled>Выберите из списка</option>
        {types?.map((type) => <option key={type}>{type}</option>)}
      </select>
      <img id="arrow-select" alt="down arrow icon" className={classes.arrow} src={arrowDown} />
    </div>
  );
}

export default SearchProtocol;

SearchProtocol.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
