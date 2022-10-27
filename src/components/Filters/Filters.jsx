/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import styles from './Filters.module.css';
import SelectMultiple from '../SelectMultiple/SelectMultiple';
import Select from '../Select/Select';
import DatePicker from '../DatePicker/DatePicker';
import { doGetPassportTypes } from '../../store/userActions';
import { history } from '../../store/main';

export default function Filters({
  singleselectFilter, onChange, onDrop, multiselectFilter, datePickerFilter, toggle,
}) {
  const dispatch = useDispatch();
  const [date, setDate] = useState(null);
  const [overwork, setOverwork] = useState(false);
  const [requiredFix, setRequiredFix] = useState(false);
  const [deviceType, setDeviceType] = useState(['']);
  const [passportType, setPassportType] = useState(singleselectFilter.options[0].name);
  const { t } = useTranslation();

  useEffect(() => {
    if (onChange !== undefined) {
      onChange({
        multiSelect: deviceType,
        date,
        overwork,
        requiredFix,
        singleSelect: passportType,
      });
    }
  }, [date, overwork, requiredFix, deviceType, passportType]);

  useEffect(() => {
    doGetPassportTypes(dispatch)
      .then()
      .catch((err) => {
        if (err.response.status === 401) history.push('/');
      });
  }, []);

  const dropFilters = () => {
    setDate(null);
    setOverwork(false);
    setRequiredFix(false);
    setDeviceType(['']);
    if (onDrop !== undefined) onDrop();
  };

  return toggle === true ? (
    <div className={styles.contentWrapper}>
      <div className={styles.filtersWrapper}>
        {multiselectFilter.display && (
          <div className={styles.column}>
            <div className={styles.filterName}>{t(multiselectFilter.name)}</div>
            <div className={styles.deviceTypeSelect}>
              <SelectMultiple
                onChange={(e) => setDeviceType(e)}
                options={multiselectFilter.options}
              />
            </div>
          </div>
        )}
        {datePickerFilter.display && (
          <div className={styles.column}>
            <div className={styles.filterName}>{t(datePickerFilter.name)}</div>
            <DatePicker
              value={moment(date).format('yyyy-MM-DD')}
              onChange={(e) => setDate(e)}
            />
          </div>
        )}
        {singleselectFilter.display && (
          <div className={styles.column}>
            <div className={styles.filterName}>{t(singleselectFilter.name)}</div>
            <div className={styles.deviceTypeSelect}>
              <Select
                options={singleselectFilter.options}
                onChange={(e) => setPassportType(e.value)}
              />
            </div>
          </div>
        )}

        <div className={classNames(styles.column, styles.fullWidthButton)}>
          <div className={styles.dropButtonWrapper}>
            <h2 onClick={dropFilters} className={styles.dropButton}>Сбросить</h2>
          </div>
        </div>
      </div>
    </div>
  ) : (<div />);
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
  singleselectFilter: PropTypes.instanceOf({
    display: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.instanceOf({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      state: PropTypes.bool.isRequired,
    })),
  }).isRequired,
  datePickerFilter: PropTypes.instanceOf({
    display: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  multiselectFilter: PropTypes.instanceOf({
    display: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.instanceOf({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      state: PropTypes.bool.isRequired,
    })),
  }).isRequired,
};
