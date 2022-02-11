import { useState, useEffect } from "react";

import ScanButton from "../../components/ScanButton/ScanButton";
import Search from "../../components/Search/Search";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import Filters from "../../components/Filters/Filters";

import {doGetPassports} from "../../store/userActions";
import {useDispatch, useSelector} from "react-redux";
import {getAuthorizationStatus, getPassports, getPassportsNumber} from "../../store/selectors";
import {history} from "../../store/main";

import styles from "./TechnicalControlDepartment.module.css"
import PrintButton from "../../components/PrintButton/PrintButton";

function TechnicalControlDepartment() {

  let dispatch = useDispatch()

    let [pageSize, setPageSize] = useState(11)
    let [filtersValues, setFiltersValues] = useState({deviceType: [''], date: null, overwork: null, requiredFix: null})
    let [searchValue, setSearchValue] = useState('')
    let [page, setPage] = useState(localStorage.getItem('tablePage') || 1)
    let [filtersDisplay, changeFiltersDisplay] = useState(true)
    let [sortingDirection, setSortingDirection] = useState('asc')

    let authorized = useSelector(getAuthorizationStatus)
    let pages = Math.ceil(useSelector(getPassportsNumber) / pageSize)
    let rows = useSelector(getPassports)?.toJS()


    useEffect(() => {
        fetchPassports()
    }, [filtersValues, sortingDirection, page, pageSize])

    useEffect(() => {
        if (rows.length === 0)
            fetchPassports()
        if (page > pages && pages !== 0)
            setPage(pages)
    }, [rows])

    let fetchPassports = () => {
        let {deviceType, date, overwork, requiredFix} = filtersValues
        if (authorized) {
            doGetPassports(dispatch, page, pageSize, searchValue, date, requiredFix, overwork, deviceType, sortingDirection)
                .then((res) => {
                    // correctPage()
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
                <Search value={searchValue} onSearch={() => fetchPassports()} onChange={setSearchValue}/>
                <SettingsButton onClick={() => {
                    changeFiltersDisplay(!filtersDisplay)
                    filtersDisplay ? setPageSize(13) : setPageSize(11)
                }}/>
                <PrintButton/>
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
            </div>
        </div>
  )
}

export default TechnicalControlDepartment