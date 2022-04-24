import styles from './Sidebar.module.css'
import logo from '../../assets/logo.png'
// import {useEffect, useState} from "react";


import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {history} from "../../store/main";
import clsx from "clsx";

import passportsIcon from '../../assets/passports.svg'
import employeesIcon from '../../assets/employees.svg'
import schemasIcon from '../../assets/schemas.svg'
// import exitIcon from '../../assets/exit.png'


export default function Sidebar () {
    let pathname = useSelector((state) => state.router.location.pathname)
    let {t} = useTranslation()

    let changeLocation = (path) => {
        history.push(path)
    }
    let logout = () => {
        localStorage.clear()
        history.push('/')
    }
    return (
        <nav className={styles.columnWrapper}>
            <div className={styles.logoIcon}>
                <img src={logo} alt="simple placeholder for logo"/>
            </div>
            <div className={styles.menu}>
                <div className={clsx(styles.menuItem, {[styles.selectedItem]: pathname === '/passports'})}
                    onClick={() => changeLocation('/passports')}
                >
                    <div className={styles.topLine}/>
                    <img src={passportsIcon} alt="passports icon"/>
                    <div className={styles.menuItemDescription}>{t('sidebar.Passports')}</div> 
                    <div className={styles.bottomLine}/>
                </div>
                <div className={clsx(styles.menuItem, {[styles.selectedItem]: pathname === '/tcd'})}
                    onClick={() => changeLocation('/tcd')}
                >
                    <div className={styles.topLine}/>
                    <img src={passportsIcon} alt="passports icon"/>
                    <div className={styles.menuItemDescription}>{t("sidebar.TCD")}</div> 
                    <div className={styles.bottomLine}/>
                </div>
                <div className={clsx(styles.menuItem, {[styles.selectedItem]: pathname === '/employees'})}
                    onClick={() => changeLocation('/employees')}
                >
                    <div className={styles.topLine}/>
                    <img src={employeesIcon} alt="employees icon"/>
                    <div className={styles.menuItemDescription}>{t('sidebar.Employees')}</div>
                    <div className={styles.bottomLine}/>
                </div>
                <div className={clsx(styles.menuItem, {[styles.selectedItem]: pathname === '/production-schemas'})}
                    onClick={() => changeLocation('/production-schemas')}
                >
                    <div className={styles.topLine}/>
                    <img src={schemasIcon} alt="schemas icon"/>
                    <div className={styles.menuItemDescription}>{t('sidebar.Schemas')}</div>
                    <div className={styles.bottomLine}/>
                </div>
                <div className={styles.menuItem}>
                    <div onClick={logout} className={styles.menuItemDescription}>{t('sidebar.Logout')}</div>
                </div>
            </div>
        </nav>
    )
}