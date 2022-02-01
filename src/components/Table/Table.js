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

export default function Table(props) {
    const pageSize = props.pageSize
    let page = props.startPage
    let pages = Math.ceil(props.passportsNumber/pageSize)
    let buttonsClickHandler = (page) => {
        props.onPageChange && props.onPageChange(page)
    }

    let onInputChange = (e) => {
        let value = e.target.value
        if (typeof parseInt(value) === "number") {
            if(value === '')
                buttonsClickHandler(1)
            else if (value > 0 && value <= pages)
                buttonsClickHandler(parseInt(e.target.value))
        }
    }
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
                        <img src={sorting} alt="sorting icon"/>
                        <div>Дата завершения</div>
                    </td>
                </thead>
                <tbody>
                    {props.rowsData.map((item, index) => {
                        // if (index >= page * pageSize && index < (page+1)*pageSize)
                        return (<tr key={index}>
                            <td id={styles.timeCol}>
                                {item.overwork && (<img src={timeIcon} alt="Overwork icon"/>)}
                            </td>
                            <td id={styles.fixCol}>
                                {item.needFix && (<img src={fixIcon} alt="Fix required icon"/>)}
                            </td>
                            <td onClick={() => history.push(`/passport/${item.internal_id}`)} id={styles.nameCol}>{item.model}</td>
                            <td id={styles.typeCol}>{item.type !== null ? item.type : 'Не указан'}</td>
                            <td id={styles.dateTimeCol}>
                                <div>{moment(item.time).format("DD.MM.YY HH:MM")}</div>
                            </td>
                        </tr>)
                    })}
                </tbody>
            </table>
            <div className={styles.pageSelectorWrapper}>
                <img onClick={() => buttonsClickHandler(page > 1 ? (page - 1) : page)} className={styles.arrows} src={leftArrow} alt="Previous page arrow"/>
                <input onChange={onInputChange} className={styles.outlinedPageNumberWrapper} value={page}/>
                <img className={styles.slashSeparator} src={slashIcon} alt="Pages slash separator"/>
                <div className={styles.pageNumberWrapper}>{pages}</div>
                <img onClick={() => buttonsClickHandler(page >= pages ? page : page + 1)} className={styles.arrows} src={rightArrow} alt="Next page arrow"/>
            </div>
        </div>
    );
}
