import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { history } from '../../store/main';
import timeIcon from '../../assets/time_icon.svg';
import fixIcon from '../../assets/fix_icon.svg';
import sorting from '../../assets/sorting.svg';
import './table.scoped.css';
import leftArrow from '../../assets/arrrow_left.svg';
import rightArrow from '../../assets/arrow_right.svg';
import slashIcon from '../../assets/slash.svg';
import clsx from 'clsx';

export default function Table(props) {

  let [direction, setDirection] = useState(false);

  let onInputChange = (e) => {
    let value = e.target.value;
    if (typeof parseInt(value) === 'number') {
      if (value === '') {
        setPage(1);
      } else if (value > 0 && value <= props.pages) {
        setPage(parseInt(e.target.value));
      }
    }
  };

  let checkDate = (dateString) => {
    if (dateString === 'Invalid date') {
      return 'Can\'t find time';
    }
    return dateString;
  };

  let setPage = (page) => {
    props.setPage && props.setPage(page);
  };

  let decreasePage = () => {
    if (props.page > 1) {
      setPage(parseInt(props.page) - 1);
    } else {
      setPage(props.pages)
    }
  };

  let increasePage = () => {
    if (props.page < props.pages) {
      setPage(parseInt(props.page) + 1);
    } else {
      setPage(1)
    }
  };

  useEffect(() => {
    props.onDirectionChange && props.onDirectionChange(!direction ? 'asc' : 'desc');
  }, [direction]);

  useEffect(() => {
    if (props.page > props.pages) {
      props.setPage && props.setPage(props.pages);
    }
  }, [props.pages])

  return (
    <div>
      <table>
        <thead>
        {props.showTimeIcon && (
          <td id="timeCol">
            <img src={timeIcon} alt="Overwork icon"/>
          </td>
        )}
        {props.showFixIcon && (
          <td id="fixCol">
            <img src={fixIcon} alt="Fix required icon"/>
          </td>
        )}

        <td id="nameCol">{props.headerRow[0]}</td>
        <td id="typeCol">{props.headerRow[1]}</td>
        <td id="dateTimeCol">
          <img className={clsx({ ["reversed"]: direction })}
               onClick={() => setDirection(!direction)} src={sorting} alt="sorting icon"/>
          <div>{props.headerRow[2]}</div>
        </td>
        </thead>
        <tbody>
        {props.type === 'passports' &&
          props.rowsData.map((item, index) => {
            return (<tr key={index}>
              {props.showTimeIcon && (
                <td id="timeCol">
                  {item.overwork && (<img src={timeIcon} alt="Overwork icon"/>)}
                </td>
              )}
              {props.showFixIcon && (
                <td id="fixCol">
                  {item.needFix && (<img src={fixIcon} alt="Fix required icon"/>)}
                </td>
              )}
              <td onClick={() => props.redirectFunction(item[props.rowsKeys.id])}
                  id="nameCol">{item[props.rowsKeys.nameCol]}</td>
              <td id="typeCol">{item[props.rowsKeys.typeCol] !== null ? item[props.rowsKeys.typeCol] : 'Сборка'}</td>
              <td id="dateTimeCol">
                <div>{checkDate(moment(item[props.rowsKeys.dateTimeCol])
                  .format('DD.MM.YYYY HH:MM:SS'))}</div>
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
               value={props.page}/>
        <img className="slashSeparator" src={slashIcon} alt="Pages slash separator"/>
        <div className="pageNumberWrapper">{props.pages}</div>
        <div onClick={increasePage} className="arrows">
          <img src={rightArrow} alt="Next page arrow"/>
        </div>
      </div>
    </div>
  );
}
