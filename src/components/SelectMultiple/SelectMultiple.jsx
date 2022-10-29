/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './SelectMultiple.module.css';
import Checkbox from '../Checkbox/Checkbox';
import arrowDownIcon from '../../assets/arrow_down.svg';

export default function SelectMultiple({ onChange, options }) {
  const [checkboxes, setCheckboxes] = useState([]);
  const [selectStatus, toggleSelect] = useState(false);
  const [selectedElements, changeSelection] = useState('Выберите из списка');
  const { t } = useTranslation();

  const resetSelection = () => {
    let arr = [...checkboxes];
    arr = arr.map((item) => ({ ...item, state: false }));
    setCheckboxes(arr);
  };

  const updateCheckbox = (index) => {
    let arr = [...checkboxes];
    arr = arr.map((item, innerIndex) => {
      const element = { ...item };
      if (index === innerIndex) element.state = !element.state;
      return element;
    });
    setCheckboxes(arr);
  };

  useEffect(() => {
    setCheckboxes(options);
  }, [options]);

  useEffect(() => {
    let res = '';
    checkboxes.filter((v) => v.state === true).forEach((item, index, arr) => {
      res += item.name;
      if (index !== arr.length - 1) res += ',';
    });
    if (res !== '') {
      let temp = res;
      if (res.length > 26) temp = `${res.slice(0, 26)}...`;
      changeSelection(temp);
    } else {
      changeSelection(t('filters.ChooseFromList'));
    }
    if (onChange !== undefined) onChange(res);
  }, [checkboxes]);

  return (
    <div className={clsx(styles.selectWrapper, { [styles.selectWrapperActive]: selectStatus })}>
      <ul className={styles.contentWrapper}>
        <div
          onClick={() => toggleSelect(!selectStatus)}
          className={
            clsx(styles.selectedContent, { [styles.selectedContentActive]: selectStatus })
          }
        >
          <div className={styles.selectedContentText}>{selectedElements}</div>
          <img className={clsx({ [styles.rotatedArrow]: selectStatus })} src={arrowDownIcon} alt="Down arrow icon" />
        </div>
        <div className={clsx(styles.checkboxesWrapper, { [styles.hidden]: !selectStatus })}>
          <div className={styles.dropButtonWrapper}>
            <h2 onClick={resetSelection} className={styles.dropButton}>{t('filters.selects.removeSelections')}</h2>
          </div>
          {checkboxes.map((item, index) => (
            <div key={item.name + item.state}>
              <Checkbox checked={item.state} onChange={() => updateCheckbox(index)} variant="small">{item.name}</Checkbox>
            </div>
          ))}
        </div>

      </ul>
    </div>
  );
}

SelectMultiple.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.instanceOf({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    state: PropTypes.bool.isRequired,
  })).isRequired,
};
