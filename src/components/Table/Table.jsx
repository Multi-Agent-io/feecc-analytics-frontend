/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';
import timeIcon from '../../assets/time_icon.svg';
import fixIcon from '../../assets/fix_icon.svg';
import sorting from '../../assets/sorting.svg';
// import styles from './Table.module.css';
import './table.scoped.css';
import leftArrow from '../../assets/arrrow_left.svg';
import rightArrow from '../../assets/arrow_right.svg';
import slashIcon from '../../assets/slash.svg';

export default function Table({
  pages, setPage, page, onDirectionChange, showFixIcon,
  showTimeIcon, headerRow, rowsData, type, rowsKeys, redirectFunction,
}) {
  const [direction, setDirection] = useState(false);

  const onInputChange = (e) => {
    const { value } = e.target;
    if (typeof parseInt(value, 10) === 'number') {
      if (value === '') {
        setPage(1);
      } else if (value > 0 && value <= pages) {
        setPage(parseInt(value, 10));
      }
    }
  };

  const checkDate = (dateString) => {
    if (dateString === 'Invalid date') {
      return 'Can\'t find time';
    }
    return dateString;
  };

  const decreasePage = () => {
    if (page > 1) {
      setPage(parseInt(page, 10) - 1);
    } else {
      setPage(pages);
    }
  };

  const increasePage = () => {
    if (page < pages) {
      setPage(parseInt(page, 10) + 1);
    } else {
      setPage(1);
    }
  };

  useEffect(() => {
    onDirectionChange(!direction ? 'asc' : 'desc');
  }, [direction]);

  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages]);

  return (
    <div>
      <table>
        <thead>
        {showTimeIcon && (
          <td id="timeCol">
            <img src={timeIcon} alt="Overwork icon"/>
          </td>
        )}
        {showFixIcon && (
          <td id="fixCol">
            <img src={fixIcon} alt="Fix required icon"/>
          </td>
        )}

        <td id="nameCol">{headerRow[0]}</td>
        <td id="typeCol">{headerRow[1]}</td>
        <td id="dateTimeCol">
          <img className={clsx({ "reversed": direction })}
               onClick={() => setDirection(!direction)} src={sorting} alt="sorting icon"/>
          <div>{headerRow[2]}</div>
        </td>
        </thead>
        <tbody>
        {type === 'passports' &&
          rowsData.map((item, index) => {
            return (<tr key={index}>
              {showTimeIcon && (
                <td id="timeCol">
                  {item.overwork && (<img src={timeIcon} alt="Overwork icon"/>)}
                </td>
              )}
              {showFixIcon && (
                <td id="fixCol">
                  {item.needFix && (<img src={fixIcon} alt="Fix required icon"/>)}
                </td>
              )}
              <td onClick={() => redirectFunction(item[rowsKeys.id])}
                  id="nameCol">{item[rowsKeys.nameCol]}</td>
              <td id="typeCol">{item[rowsKeys.typeCol] !== null ? item[rowsKeys.typeCol] : 'Сборка'}</td>
              <td id="dateTimeCol">
                <div>{checkDate(moment(item[rowsKeys.dateTimeCol])
                  .format('DD.MM.YYYY HH:mm:ss'))}</div>
              </td>
            </tr>);
          })}
        </tbody>
      </table>
      <div className="pageSelectorWrapper">
        <div onClick={decreasePage} className="arrows">
          <img src={leftArrow} alt="Previous page arrow"/>
        </div>
        <input onChange={onInputChange} className="outlinedPageNumberWrapper"
               value={page}/>
        <img className="slashSeparator" src={slashIcon} alt="Pages slash separator"/>
        <div className="pageNumberWrapper">{pages}</div>
        <div onClick={increasePage} className="arrows">
          <img src={rightArrow} alt="Next page arrow"/>
        </div>
      </div>
    </div>
  );
}

Table.propTypes = {
  // setParentPage: PropTypes.func.isRequired,
  onDirectionChange: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  redirectFunction: PropTypes.func.isRequired,
  pages: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['passports', undefined]).isRequired,
  rowsData: PropTypes.arrayOf({
    overwork: PropTypes.bool.isRequired,
    status: PropTypes.oneOf(['revision', undefined]),
    type: PropTypes.string.isRequired,
  }).isRequired,
  showFixIcon: PropTypes.bool.isRequired,
  showTimeIcon: PropTypes.bool.isRequired,
  headerRow: PropTypes.arrayOf(PropTypes.string).isRequired,
  rowsKeys: PropTypes.instanceOf({
    nameCol: PropTypes.string.isRequired,
    typeCol: PropTypes.string.isRequired,
    dateTimeCol: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};
