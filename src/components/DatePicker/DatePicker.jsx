/* eslint-disable react/no-array-index-key */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './DatePicker.module.css';

export default function DatePicker({ onChange, value }) {
  const { t } = useTranslation();
  const daysMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const monthMap = [
    t('filters.calendar.months.January'),
    t('filters.calendar.months.February'),
    t('filters.calendar.months.March'),
    t('filters.calendar.months.April'),
    t('filters.calendar.months.May'),
    t('filters.calendar.months.June'),
    t('filters.calendar.months.July'),
    t('filters.calendar.months.August'),
    t('filters.calendar.months.September'),
    t('filters.calendar.months.October'),
    t('filters.calendar.months.November'),
    t('filters.calendar.months.December'),
  ];

  const getNumberOfDays = (year, month) => 40 - new Date(year, month, 40).getDate();

  const getDayDetails = ({
    index, numberOfDays, firstDay, year, month,
  }) => {
    const date = index - firstDay;
    const day = index % 7;
    let prevMonth = month - 1;
    let prevYear = year - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear -= 1;
    }
    const prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
    const newDate = (date < 0 ? prevMonthNumberOfDays + date : date % numberOfDays) + 1;
    let currentMonth = -1;
    if (date < 0) {
      currentMonth = -1;
    } else if (date >= numberOfDays) {
      currentMonth = 1;
    } else {
      currentMonth = 0;
    }
    // const currentMonth = date < 0 ? -1 : (date >= numberOfDays ? 1 : 0);
    const timestamp = new Date(year, month, newDate).getTime();
    return {
      date: newDate,
      day,
      month: currentMonth,
      timestamp,
      dayString: daysMap[day],
    };
  };

  const getMonthDetails = (year, month) => {
    const firstDay = (new Date(year, month)).getDay();
    const numberOfDays = getNumberOfDays(year, month);
    const monthArray = [];
    const rows = 6;
    let currentDay = null;
    let index = 1;
    const cols = 7;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        currentDay = getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        monthArray.push(currentDay);
        index += 1;
      }
    }
    return monthArray;
  };

  const getDateFromDateString = (dateValue) => {
    const dateData = dateValue.split('-').map((d) => parseInt(d, 10));
    if (dateData.length < 3) {
      return null;
    }
    const year = dateData[0];
    const month = dateData[1];
    const date = dateData[2];
    return { year, month, date };
  };

  const getMonthString = (month) => monthMap[Math.max(Math.min(11, month), 0)] || 'Month';

  const getDateStringFromTimestamp = (timestamp) => {
    const dateObject = new Date(timestamp);
    const month = dateObject.getMonth() + 1;
    const date = dateObject.getDate();
    return `${dateObject.getFullYear()}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`;
  };

  const inputRef = useRef();

  const oneDay = 60 * 60 * 24 * 1000;
  // eslint-disable-next-line max-len
  const todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

  const ref = useRef();
  const [showDatePicker, changeShowDatePicker] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(todayTimestamp);
  const [monthDetails, setMonthDetails] = useState(getMonthDetails(year, month));

  const isCurrentDay = (day) => day.timestamp === todayTimestamp;

  const isSelectedDay = (day) => day.timestamp === selectedDay;

  const setDateToInput = (timestamp) => {
    inputRef.current.value = getDateStringFromTimestamp(timestamp);
  };

  const setDate = ({ newYear, newMonth, date }) => {
    const newSelectedDay = new Date(newYear, newMonth - 1, date).getTime();
    setSelectedDay(newSelectedDay);
    if (onChange !== undefined) {
      onChange(selectedDay);
    }
  };

  const updateDateFromInput = () => {
    const dateValue = inputRef.current.value;
    const dateData = getDateFromDateString(dateValue);
    if (dateData !== null) {
      setDate(dateData);
      setYear(dateData.year);
      setMonth(dateData.month);
      setMonthDetails(getMonthDetails(dateData.year, dateData.month - 1));
    }
  };

  const onDateClick = (day) => {
    if (onChange !== undefined) {
      onChange(day.timestamp);
    }
    setSelectedDay(day.timestamp);
    setDateToInput(day.timestamp);
  };

  const setMonthOffset = (offset) => {
    let localMonth = month + offset;
    let localYear = year;
    if (localMonth === -1) {
      localMonth = 11;
      localYear -= 1;
    } else if (localMonth === 12) {
      localMonth = 0;
      localYear += 1;
    }
    setYear(localYear);
    setMonth(localMonth);
    setMonthDetails(getMonthDetails(localYear, localMonth));
  };

  const addBackdrop = (e) => {
    if (!ref.current.contains(e.target)) {
      changeShowDatePicker(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', addBackdrop);
    return function cleanup() {
      window.removeEventListener('click', addBackdrop);
    };
  }, []);

  // Render methods

  const renderCalendar = () => {
    const days = monthDetails.map((day, index) => (
      <div
        className={clsx(styles.cDayContainer, {
          [styles.disabled]: day.month !== 0,
          [styles.highlight]: isCurrentDay(day),
          [styles.highlightGreen]: isSelectedDay(day),
        })}
        key={index}
      >
        <div className={styles.cdcDay}>
          <span onClick={() => onDateClick(day)}>{day.date}</span>
        </div>
      </div>
    ));
    return (
      <div className={styles.cContainer}>
        <div className={styles.ccHead}>
          {[
            t('filters.calendar.days.Mon'),
            t('filters.calendar.days.Tue'),
            t('filters.calendar.days.Wed'),
            t('filters.calendar.days.Thu'),
            t('filters.calendar.days.Fri'),
            t('filters.calendar.days.Sat'),
            t('filters.calendar.days.Sun')
          ].map((d, i) => <div key={i} className={styles.cchName}>{d}</div>)}
        </div>
        <div className={styles.ccBody}>{days}</div>
      </div>
    );
  };

  return (
    <div ref={ref} className={styles.MyDatePicker}>
      <div className={clsx(styles.mdpInput, { [styles.mdpInputActive]: showDatePicker })}
        onClick={() => changeShowDatePicker(!showDatePicker)}>
        <input value={value} type="date" ref={inputRef} onChange={updateDateFromInput} />
        {showDatePicker && (<span className={styles.mdpLine}></span>)}
      </div>
      {showDatePicker ? (
        <div className={styles.mdpContainer}>
          <div className={styles.mdpcHead}>
            <div className={styles.mdpchButton}>
              <div className={styles.mdpchbInner} onClick={() => setMonthOffset(-1)}>
                <span className={styles.mdpchbiLeftArrows} />
              </div>
            </div>
            <div className={styles.mdpchContainer}>
              <div className={styles.mdpchcMonth}>{getMonthString(month)}</div>
              <div className={styles.mdpchcYear}>{year}</div>
            </div>
            <div className={styles.mdpchButton}>
              <div className={styles.mdpchbInner} onClick={() => setMonthOffset(1)}>
                <span className={styles.mdpchbiRightArrows} />
              </div>
            </div>
          </div>
          <div className={styles.mdpcBody}>{renderCalendar()}</div>
        </div>
      ) : ''}
    </div>
  );
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
};
