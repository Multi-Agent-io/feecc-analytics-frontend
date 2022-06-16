/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './Select.module.css';
import Checkbox from '../Checkbox/Checkbox';
import arrowDownIcon from '../../assets/arrow_down.svg';

export default function Select({ onChange, options }) {
  const [checkboxes, setCheckboxes] = useState([]);
  const [selectStatus, toggleSelect] = useState(false);
  const [selectedElement, setSelectedElement] = useState('');
  const { t } = useTranslation();

  const updateCheckbox = (index) => {
    const arr = [...checkboxes];
    arr.forEach((item, innerIndex) => {
      const tempItem = { ...item };
      if (index === innerIndex) {
        tempItem.state = true;
        setSelectedElement(item.name);
      } else {
        tempItem.state = false;
      }
      return tempItem;
    });
    setCheckboxes(arr);
    if (onChange !== undefined) {
      onChange({
        name: checkboxes[index].name,
        value: checkboxes[index].value,
      });
    }
  };

  useEffect(() => {
    setCheckboxes(options);
    setTimeout(() => {
      if (checkboxes[0] !== undefined && checkboxes[0].state === true) {
        setSelectedElement(checkboxes[0].name);
      } else {
        setSelectedElement(t('filters.ChooseFromList'));
      }
    }, 300);
  }, []);

  return (
    <div className={clsx(styles.selectWrapper, { [styles.selectWrapperActive]: selectStatus })}>
      <ul className={styles.contentWrapper}>
        <div
          onClick={() => toggleSelect(!selectStatus)}
          className={clsx(
            styles.selectedContent,
            { [styles.selectedContentActive]: selectStatus },
          )}
        >
          <div className={styles.selectedContentText}>{selectedElement}</div>
          <img className={clsx({ [styles.rotatedArrow]: selectStatus })} src={arrowDownIcon} alt="Down arrow icon" />
        </div>
        <div className={clsx(styles.checkboxesWrapper, { [styles.hidden]: !selectStatus })}>
          {checkboxes.map((item, index) => (
            <div key={index + item.name + item.value}>
              <Checkbox checked={item.state} onChange={() => updateCheckbox(index)} variant="small">{item.name}</Checkbox>
            </div>
          ))}
        </div>

      </ul>
    </div>
  );
}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf({
    state: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
