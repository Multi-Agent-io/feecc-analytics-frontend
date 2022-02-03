import React from 'react';
import styles from './Search.module.css'
import searchIcon from '../../assets/search.svg'
import {useTranslation} from "react-i18next";


export default function Search(props) {
    let { t } = useTranslation()
    let onKeyDown = (e) => {
        if(e.key === "Enter")
            props.onSearch && props.onSearch()
    }
    return (
        <div className={styles.searchWrapper}>
            <div className={styles.searchIcon}>
                <img src={searchIcon} alt="search icon"/>
            </div>
            <input value={props.value || ''} onKeyDown={onKeyDown} onChange={(e) => props.onChange && props.onChange(e.target.value)} className={styles.searchField} placeholder={t('search.enterName')}/>
            <button onClick={() => props.onSearch && props.onSearch()} className={styles.searchButton}>{t('search.Find')}</button>
        </div>
    );
}
