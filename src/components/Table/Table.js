import React, {useEffect, useState} from 'react';
import moment from "moment";
import {history} from "../../store/main";
import timeIcon from '../../assets/time_icon.svg'
import fixIcon from '../../assets/fix_icon.svg'
import sorting from '../../assets/sorting.svg'
import styles from './Table.module.css'
import leftArrow from '../../assets/arrrow_left.svg'
import rightArrow from '../../assets/arrow_right.svg'
import slashIcon from '../../assets/slash.svg'
import clsx from "clsx";

export default function Table(props) {

    let [direction, setDirection] = useState(false)

    let onInputChange = (e) => {
        let value = e.target.value
        if (typeof parseInt(value) === "number") {
            if(value === '')
                setPage(1)
            else if (value > 0 && value <= props.pages)
                setPage(parseInt(e.target.value))
        }
    }

    let checkDate = (dateString) => {
        if(dateString === "Invalid date")
            return "Can't find time"
        return dateString
    }

    let setPage = (page) => {
        props.setPage && props.setPage(page)
    }

    let decreasePage = () => {
        if (props.page > 1)
            setPage(parseInt(props.page)-1)
    }

    let increasePage = () => {
        if (props.page < props.pages)
            setPage(parseInt(props.page)+1)
    }

    useEffect(() => {
        props.onDirectionChange && props.onDirectionChange(!direction ? "asc" : "desc")
    }, [direction])

    return (
        <div>
            <table>
                <thead>
                    <td id={styles.timeCol}>
                        <img src={timeIcon} alt="Overwork icon"/>
                    </td>
                    <td id={styles.fixCol}>
                        <img src={fixIcon} alt="Fix required icon"/>
                    </td>
                    <td id={styles.nameCol}>Название</td>
                    <td id={styles.typeCol}>Тип изделия</td>
                    <td id={styles.dateTimeCol}>
                        <img className={clsx({[styles.reversed]: direction})} onClick={() => setDirection(!direction)} src={sorting} alt="sorting icon"/>
                        <div>Дата завершения</div>
                    </td>
                </thead>
                <tbody>
                    {props.rowsData.map((item, index) => {
                        return (<tr key={index}>
                            <td id={styles.timeCol}>
                                {item.overwork && (<img src={timeIcon} alt="Overwork icon"/>)}
                            </td>
                            <td id={styles.fixCol}>
                                {item.needFix && (<img src={fixIcon} alt="Fix required icon"/>)}
                            </td>
                            <td onClick={() => history.push(`/passport/${item.internal_id}`)} id={styles.nameCol}>{item.model}</td>
                            <td id={styles.typeCol}>{item.type !== null ? item.type : 'Сборка'}</td>
                            <td id={styles.dateTimeCol}>
                                <div>{checkDate(moment(item.date).format("DD.MM.YYYY HH:MM:SS"))}</div>
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <div className={styles.pageSelectorWrapper}>
                <div onClick={decreasePage} className={styles.arrows} >
                    <img src={leftArrow} alt="Previous page arrow"/>
                </div>
                <input onChange={onInputChange} className={styles.outlinedPageNumberWrapper} value={props.page}/>
                <img className={styles.slashSeparator} src={slashIcon} alt="Pages slash separator"/>
                <div className={styles.pageNumberWrapper}>{props.pages}</div>
                <div onClick={increasePage} className={styles.arrows}>
                    <img src={rightArrow} alt="Next page arrow"/>
                </div>
            </div>
        </div>
    );
}
