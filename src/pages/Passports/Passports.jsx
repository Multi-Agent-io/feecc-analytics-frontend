import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Search, SettingsButton, Filters, Table,
} from '../../components';

import { doGetPassports } from '../../store/userActions';
import {
  getAuthorizationStatus,
  getPassports,
  getPassportsNumber,
} from '../../store/selectors';

import { history } from '../../store/main';

import styles from './Passports.module.css';

export default function Passports() {
  const dispatch = useDispatch();

  const [pageSize, setPageSize] = useState(11);
  const [filtersValues, setFiltersValues] = useState({
    deviceType: [''],
    date: null,
    overwork: null,
    requiredFix: null,
  });
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(localStorage.getItem('tablePage') || 1);
  const [filtersDisplay, changeFiltersDisplay] = useState(true);
  const [sortingDirection, setSortingDirection] = useState('asc');

  const authorized = useSelector(getAuthorizationStatus);
  const pages = Math.ceil(useSelector(getPassportsNumber) / pageSize);
  const rows = useSelector(getPassports)?.toJS();

  const fetchPassports = () => {
    const {
      deviceType, date, overwork, requiredFix, passportType,
    } = filtersValues;
    if (authorized) {
      doGetPassports(
        dispatch,
        page,
        pageSize,
        searchValue,
        date,
        requiredFix,
        overwork,
        deviceType,
        sortingDirection,
        passportType,
      )
        .then(() => {})
        .catch((err) => {
          if (err.response.status === 401) history.push('/');
        });
    }
  };

  const dropSettings = () => {
    setSearchValue('');
    setPage(1);
  };

  const setTablePage = (tablePage) => {
    setPage(parseInt(tablePage, 10));
    localStorage.setItem('tablePage', page);
  };

  useEffect(() => {
    fetchPassports();
  }, [filtersValues, sortingDirection, page, pageSize, searchValue]);

  useEffect(() => {
    if (rows.length === 0) fetchPassports();
    if (page > pages && pages !== 0) setPage(pages);
  }, [fetchPassports, rows]);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.searchWrapper}>
        <Search
          value={searchValue}
          onSearch={() => fetchPassports()}
          onChange={setSearchValue}
        />
        <SettingsButton
          onClick={() => {
            changeFiltersDisplay(!filtersDisplay);
            if (filtersDisplay) {
              setPageSize(13);
            } else {
              setPageSize(11);
            }
          }}
        />
      </div>
      <div className={styles.contentWrapper}>
        <Filters
          onChange={(values) => {
            if (page !== localStorage.getItem('tablePage') && page !== 1) {
              setPage(1);
            }
            setFiltersValues(values);
          }}
          onDrop={dropSettings}
          toggle={filtersDisplay}
        />
        <Table
          onDirectionChange={setSortingDirection}
          type="passports"
          setPage={setTablePage}
          rowsData={rows}
          page={page}
          pageSize={pageSize}
          pages={pages}
        />
      </div>
    </div>
  );
}
