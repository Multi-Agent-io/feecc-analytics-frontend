/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';
import { history } from '../../store/main';
import timeIcon from '../../assets/time_icon.svg';
import fixIcon from '../../assets/fix_icon.svg';
import sorting from '../../assets/sorting.svg';
import styles from './Table.module.css';
import leftArrow from '../../assets/arrrow_left.svg';
import rightArrow from '../../assets/arrow_right.svg';
import slashIcon from '../../assets/slash.svg';

export default function Table({
  setParentPage, pages, page, onDirectionChange, type, rowsData,
}) {
  const [direction, setDirection] = useState(false);

  const setPage = (newPage) => {
    if (setParentPage !== undefined) {
      setParentPage(newPage);
    }
  };

  const onInputChange = (e) => {
    const { value } = e.target;
    if (typeof parseInt(value, 10) === 'number') {
      if (value === '') {
        setPage(1);
      } else if (value > 0 && value <= pages) {
        setPage(parseInt(e.target.value, 10));
      }
    }
  };

  const checkDate = (dateString) => {
    if (dateString === 'Invalid date') {
      return "Can't find time";
    }
    return dateString;
  };

  const decreasePage = () => {
    if (page > 1) {
      setPage(parseInt(page, 10) - 1);
    }
  };

  const increasePage = () => {
    if (page < pages) {
      setPage(parseInt(page, 10) + 1);
    }
  };

  useEffect(() => {
    if (onDirectionChange !== undefined) {
      onDirectionChange(!direction ? 'asc' : 'desc');
    }
  }, [direction]);

  return (
    <div>
      <table>
        <thead>
          <td id={styles.timeCol}>
            <img src={timeIcon} alt="Overwork icon" />
          </td>
          <td id={styles.fixCol}>
            <img src={fixIcon} alt="Fix required icon" />
          </td>
          <td id={styles.nameCol}>Название</td>
          <td id={styles.typeCol}>Тип изделия</td>
          <td id={styles.dateTimeCol}>
            <img className={clsx({ [styles.reversed]: direction })} onClick={() => setDirection(!direction)} src={sorting} alt="sorting icon" />
            <div>Дата завершения</div>
          </td>
        </thead>
        <tbody>
          {type === 'passports'
          && rowsData.map((item, index) => (
            <tr key={index}>
              <td id={styles.timeCol}>
                {item.overwork && (<img src={timeIcon} alt="" />)}
              </td>
              <td id={styles.fixCol}>
                {item.status === 'revision' && (<img src={fixIcon} alt="Item on revision" />)}
              </td>
              <td onClick={() => history.push(`/passport/${item.internal_id}/view`)} id={styles.nameCol}>{item.model}</td>
              <td id={styles.typeCol}>{item.type !== null ? item.type : 'Сборка'}</td>
              <td id={styles.dateTimeCol}>
                <div>{checkDate(moment(item.creation_time).format('DD.MM.YYYY HH:MM:SS'))}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pageSelectorWrapper}>
        <div onClick={decreasePage} className={styles.arrows}>
          <img src={leftArrow} alt="Previous page arrow" />
        </div>
        <input
          onChange={onInputChange}
          className={styles.outlinedPageNumberWrapper}
          value={page}
        />
        <img className={styles.slashSeparator} src={slashIcon} alt="Pages slash separator" />
        <div className={styles.pageNumberWrapper}>{pages}</div>
        <div onClick={increasePage} className={styles.arrows}>
          <img src={rightArrow} alt="Next page arrow" />
        </div>
      </div>
    </div>
  );
}

Table.propTypes = {
  setParentPage: PropTypes.func.isRequired,
  onDirectionChange: PropTypes.func.isRequired,
  pages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['passports', undefined]).isRequired,
  rowsData: PropTypes.arrayOf({
    overwork: PropTypes.bool.isRequired,
    status: PropTypes.oneOf(['revision', undefined]),
    type: PropTypes.string.isRequired,
  }).isRequired,
};
