import React from 'react';
import styles from './Sidebar.module.css'
import logo from '../../assets/Logo.svg'

import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {history} from "../../store/main";
import clsx from "clsx";

import passportsIcon from '../../assets/pasports.svg'
import otkIcon from '../../assets/otk.svg'
import employeesIcon from '../../assets/users.svg'
import schemasIcon from '../../assets/schema.svg'


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
        <aside className={styles.columnWrapper}>
            <div className={styles.logoIcon}>
                <img src={logo} alt="Multi-agent.io FEECC"/>
            </div>
            <div className={styles.menu}>
                <div className={clsx(styles.menuItem, {[styles.selectedItem]: pathname === '/passports'})}
                    onClick={() => changeLocation('/passports')}
                >
                    <img src={passportsIcon} aria-hidden="true" />
                    <div className={styles.menuItemDescription}>{t('sidebar.Passports')}</div>
                </div>
                <div className={clsx(styles.menuItem, {[styles.selectedItem]: pathname === '/tcd'})}
                    onClick={() => changeLocation('/tcd')}
                >
                    <img src={otkIcon} aria-hidden="true" />
                    <div className={styles.menuItemDescription}>{t("sidebar.TCD")}</div>
                </div>
                <div className={clsx(styles.menuItem, {[styles.selectedItem]: pathname === '/employees'})}
                    onClick={() => changeLocation('/employees')}
                >
                    <img src={employeesIcon} aria-hidden="true" />
                    <div className={styles.menuItemDescription}>{t('sidebar.Employees')}</div>
                </div>
                <div className={clsx(styles.menuItem, {[styles.selectedItem]: pathname === '/production-schemas'})}
                    onClick={() => changeLocation('/production-schemas')}
                >
                    <img src={schemasIcon} aria-hidden="true" />
                    <div className={styles.menuItemDescription}>{t('sidebar.Schemas')}</div>
                </div>
                <div className={styles.menuItem}>
                    <div onClick={logout} className={styles.menuItemDescription}>{t('sidebar.Logout')}</div>
                </div>
            </div>
        </aside>
    )
}