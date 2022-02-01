import React, {useEffect, useRef, useState} from 'react';
import clsx from "clsx";
import styles from './DatePicker.module.css'
import {useTranslation} from "react-i18next";

export default function DatePicker(props) {

    let {t} = useTranslation()
    let daysMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let monthMap = [
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
        t('filters.calendar.months.December')
    ];

    let getDayDetails = ({index, numberOfDays, firstDay, year, month}) => {
        let date = index - firstDay
        let day = index%7
        let prevMonth = month - 1
        let prevYear = year - 1
        if (prevMonth < 0) {
            prevMonth = 11
            prevYear--
        }
        let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth)
        let _date = (date < 0 ? prevMonthNumberOfDays + date : date % numberOfDays) + 1
        let currentMonth = date < 0 ? -1 : date >= numberOfDays ? 1 : 0
        let timestamp = new Date(year, month, _date).getTime()
        return {
            date: _date,
            day,
            month: currentMonth, timestamp,
            dayString: daysMap[day]
        }
    }

    let getNumberOfDays = (year, month) => {
        return 40 - new Date(year, month, 40).getDate()
    }

    let getMonthDetails = (year, month) => {
        let firstDay = (new Date(year, month)).getDay()
        let numberOfDays = getNumberOfDays(year, month)
        let monthArray = []
        let rows = 6
        let currentDay = null
        let index = 1
        let cols = 7
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                currentDay = getDayDetails({
                    index,
                    numberOfDays,
                    firstDay,
                    year,
                    month
                })
                monthArray.push(currentDay)
                index++
            }
        }
        return monthArray
    }

    let isCurrentDay = (day) => day.timestamp === todayTimestamp

    let isSelectedDay = (day) => day.timestamp === selectedDay

    let getDateFromDateString = (dateValue) => {
        let dateData = dateValue.split('-').map(d => parseInt(d, 10))
        if (dateData.length < 3)
            return null
        let year = dateData[0]
        let month = dateData[1]
        let date = dateData[2]
        return {year, month, date}
    }
    let getMonthString = (month) => monthMap[Math.max(Math.min(11, month), 0)] || 'Month'

    let getDateStringFromTimestamp = (timestamp) => {
        let dateObject = new Date(timestamp)
        let month = dateObject.getMonth()+1
        let date = dateObject.getDate()
        return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
    }

    let setDate = ({year, month, date}) => {
        let selectedDay = new Date(year, month - 1, date).getTime()
        setSelectedDay(selectedDay)
        props.onChange && props.onChange(selectedDay)
    }

    let updateDateFromInput = () => {
        let dateValue = inputRef.current.value
        let dateData = getDateFromDateString(dateValue)
        if(dateData !== null) {
            setDate(dateData)
            setYear(dateData.year)
            setMonth(dateData.month)
            setMonthDetails(getMonthDetails(dateData.year, dateData.month - 1))
        }
    }

    let inputRef = useRef()

    let setDateToInput = (timestamp) => {
        inputRef.current.value = getDateStringFromTimestamp(timestamp)
    }

    let onDateClick = (day) => {
        props.onChange && props.onChange(day.timestamp)
        setSelectedDay(day.timestamp)
        setDateToInput(day.timestamp)
    }

    let oneDay = 60 * 60 * 24 * 1000;
    let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

    let ref = useRef()
    let [showDatePicker, changeShowDatePicker] = useState(false)
    let [year, setYear] = useState(new Date().getFullYear())
    let [month, setMonth] = useState(new Date().getMonth())
    let [selectedDay, setSelectedDay] = useState(todayTimestamp)
    let [monthDetails, setMonthDetails] = useState(getMonthDetails(year, month))

    // let setYearOffset = (offset) => {
    //     setYear(year + offset)
    //     setMonthDetails(getMonthDetails(year, month))
    // }

    let setMonthOffset = (offset) => {
        let localMonth = month + offset
        let localYear = year
        if (localMonth === -1) {
            localMonth = 11
            localYear--
        } else if (localMonth === 12) {
            localMonth = 0
            localYear++
        }
        setYear(localYear)
        setMonth(localMonth)
        setMonthDetails(getMonthDetails(localYear, localMonth))
    }

    useEffect(() => {
        window.addEventListener('click', addBackdrop)

        return function cleanup() {
            window.removeEventListener('click', addBackdrop)
        }
    }, [])

    let addBackdrop = (e) => {
        if(!ref.current.contains(e.target))
            changeShowDatePicker(false)
    }

    // Render methods

    let renderCalendar = () => {
        let days = monthDetails.map((day, index) => {
            return (
                <div
                    className={clsx(
                        styles.cDayContainer, {
                            [styles.disabled]: day.month !== 0,
                            [styles.highlight]: isCurrentDay(day),
                            [styles.highlightGreen]: isSelectedDay(day)
                        })}
                    key={index}
                >
                    <div className={styles.cdcDay}>
                        <span onClick={() => onDateClick(day)}>{day.date}</span>
                    </div>
                </div>
            )
        })
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
        )
    }


    return (
        <div ref={ref} className={styles.MyDatePicker}>
            <div className={clsx(styles.mdpInput, {[styles.mdpInputActive]: showDatePicker})}
                 onClick={() => changeShowDatePicker(!showDatePicker)}>
                <input type="date" ref={inputRef} onChange={updateDateFromInput}/>
                {showDatePicker && (<span className={styles.mdpLine}></span>)}
            </div>
            {showDatePicker ? (
                <div className={styles.mdpContainer}>
                    <div className={styles.mdpcHead}>
                        <div className={styles.mdpchButton}>
                            <div className={styles.mdpchbInner} onClick={() => setMonthOffset(-1)}>
                                <span className={styles.mdpchbiLeftArrows}></span>
                            </div>
                        </div>
                        <div className={styles.mdpchContainer}>
                            <div className={styles.mdpchcMonth}>{getMonthString(month)}</div>
                            <div className={styles.mdpchcYear}>{year}</div>
                        </div>
                        <div className={styles.mdpchButton}>
                            <div className={styles.mdpchbInner} onClick={() => setMonthOffset(1)}>
                                <span className={styles.mdpchbiRightArrows}></span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mdpcBody}>{renderCalendar()}</div>
                </div>
            ) : ''}
        </div>
    );
}
