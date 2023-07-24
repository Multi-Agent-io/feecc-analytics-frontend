import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './Filters.module.css';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import SelectMultiple from '../SelectMultiple/SelectMultiple';
import Select from '../Select/Select';
import DatePicker from '../DatePicker/DatePicker';
import { doGetPassportTypes } from '../../store/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { history } from '../../store/main';
import { getAllTypes } from '../../store/selectors';

export default function Filters(props) {
  let dispatch = useDispatch();
  let [date, setDate] = useState(null);
  let [overwork, setOverwork] = useState(false);
  let [requiredFix, setRequiredFix] = useState(false);
  let [deviceType, setDeviceType] = useState(['']);
  let [passportType, setPassportType] = useState(props.singleselectFilter.options[0].name);
  let { t } = useTranslation();

  let passportTypes = useSelector(getAllTypes);

  useEffect(() => {
    props.onChange && props.onChange({
      multiSelectType: deviceType,
      date,
      overwork,
      requiredFix,
      singleSelectType: passportType
    });
  }, [date, overwork, requiredFix, deviceType, passportType]);

  useEffect(() => {
    doGetPassportTypes(dispatch)
      .then((res) => {
      })
      .catch((err) => {
        if (err.response.status === 401) {
          history.push('/');
        }
      });
  }, []);

  let dropFilters = () => {
    setDate(null);
    setOverwork(false);
    setRequiredFix(false);
    setDeviceType(['']);
    setPassportType('')
    props.onDrop && props.onDrop();
  };


  return props.toggle === true ? (
    <div className={styles.contentWrapper}>
      <div className={styles.filtersWrapper}>
        {props.multiselectFilter.display && (
          <div className={styles.column}>
            <div className={styles.filterName}>{t(props.multiselectFilter.name)}</div>
            <div className={styles.deviceTypeSelect}>
              <SelectMultiple onChange={(e) => setDeviceType(e)} options={passportTypes} type={deviceType}/>
            </div>
          </div>
        )}
        {props.datePickerFilter.display && (
          <div className={styles.column}>
            <div className={styles.filterName}>{t(props.datePickerFilter.name)}</div>
            <DatePicker value={moment(date)
              .format('yyyy-MM-DD')} onChange={(e) => setDate(e)}/>
          </div>
        )}
        {props.singleselectFilter.display && (
          <div className={styles.column}>
            <div className={styles.filterName}>{t(props.singleselectFilter.name)}</div>
            <div className={styles.deviceTypeSelect}>
              <Select
                options={props.singleselectFilter.options}
                type={passportType}
                onChange={(e) => setPassportType(e.value)}/>
            </div>
          </div>
        )}

        <div className={classNames(styles.column, styles.fullWidthButton)}>
          <div className={styles.dropButtonWrapper}>
            <h2 onClick={dropFilters} className={styles.dropButton}>Сбросить</h2>
          </div>
        </div>
      </div>
    </div>) : (<div/>);
}
