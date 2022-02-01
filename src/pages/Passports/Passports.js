import React, {useEffect, useState} from 'react';
import styles from './Passports.module.css'
import ScanButton from "../../components/ScanButton/ScanButton";
import Search from "../../components/Search/Search";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import Filters from "../../components/Filters/Filters";
import Table from "../../components/Table/Table";
import {doGetPassports} from "../../store/userActions";
import {useDispatch, useSelector} from "react-redux";
import {getAuthorizationStatus, getPassports, getPassportsNumber} from "../../store/selectors";
import {history} from "../../store/main";


export default function Passports(props) {
    let [pageSize, setPageSize] = useState(11)
    let dispatch = useDispatch()
    let authorized = useSelector(getAuthorizationStatus)
    let [filtersValues, setFiltersValues] = useState({deviceType: [''], date: null, overwork: null, requiredFix: null})
    let [searchValue, setSearchValue] = useState('')
    let [page, setPage] = useState(localStorage.getItem('tablePage') || 25)
    let [filtersDisplay, changeFiltersDisplay] = useState(true)
    let passportsNumber = useSelector(getPassportsNumber)

    let rows = useSelector(getPassports)?.toJS()

    useEffect(() => {
        localStorage.setItem('tablePage', page)
        fetchPassports()
    }, [filtersValues, page, pageSize])

    let fetchPassports = () => {
        let {deviceType, date, overwork, requiredFix } = filtersValues
        if (authorized) {
            doGetPassports(dispatch, page, pageSize, searchValue, date, requiredFix, overwork)
                .then((res) => {
                })
                .catch((err) => {
                    if (err.response.status === 401)
                        history.push('/')
                })
        }
    }

    let dropSettings = () => {
        setSearchValue('')
        setPage(1)
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.searchWrapper}>
                <ScanButton/>
                <Search value={searchValue} onChange={setSearchValue}/>
                <SettingsButton onClick={() => {
                    changeFiltersDisplay(!filtersDisplay)
                    setPageSize(13)
                }}/>
            </div>
            <div className={styles.contentWrapper}>
                <Filters
                    onChange={(values) => {
                        if (page !== localStorage.getItem('tablePage') && page !== 1)
                            setPage(1)
                        setFiltersValues(values)
                    }}
                    onDrop={dropSettings}
                    toggle={filtersDisplay}
                />
                <Table
                    onPageChange={(page) => {
                        setPage(parseInt(page))
                    }}
                    rowsData={rows}
                    startPage={page}
                    pageSize={pageSize}
                    passportsNumber={passportsNumber}
                />
            </div>
        </div>
    );
}
