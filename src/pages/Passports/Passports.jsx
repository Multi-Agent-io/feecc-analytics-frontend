import React, { useCallback, useEffect, useState } from 'react';
import styles from './Passports.module.css';
import Search from '../../components/Search/Search';
import SettingsButton from '../../components/SettingsButton/SettingsButton';
import Filters from '../../components/Filters/Filters';
import Table from '../../components/Table/Table';
import { doGetPassports } from '../../store/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthorizationStatus, getPassports, getPassportsNumber } from '../../store/selectors';
import { history } from '../../store/main';

export default function Passports(props) {

  let dispatch = useDispatch();

  let [pageSize, setPageSize] = useState(11);
  let [filtersValues, setFiltersValues] = useState({
    deviceType: [''],
    date: null,
    overwork: null,
    requiredFix: null
  });
  let [searchValue, setSearchValue] = useState('');
  let [page, setPage] = useState(localStorage.getItem('tablePage') || 1);
  let [filtersDisplay, changeFiltersDisplay] = useState(true);
  let [sortingDirection, setSortingDirection] = useState('asc');

  let authorized = useSelector(getAuthorizationStatus);
  let pages = Math.ceil(useSelector(getPassportsNumber) / pageSize);
  let rows = useSelector(getPassports)
    ?.toJS();

  const selectOptions = [
    {
      name: 'В производстве',
      value: 'production',
      state: true
    },
    {
      name: 'Произведённые',
      value: 'built',
      state: false
    },
    {
      name: 'На доработке',
      value: 'revision',
      state: false
    },
    {
      name: 'Подтверждённые',
      value: 'approved',
      state: false
    },
    {
      name: 'Выпущенные',
      value: 'finalized',
      state: false
    },
  ];

  let fetchPassports = () => {
    let {
      multiSelectType,
      date,
      overwork,
      requiredFix,
      singleSelectType
    } = filtersValues;
    if (authorized) {
      doGetPassports(dispatch, page, pageSize, searchValue, date, requiredFix, overwork, multiSelectType, sortingDirection, singleSelectType)
        .then((res) => {})
        .catch((err) => {
          if (err.response.status === 401) {
            history.push('/');
          }
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
          multiselectFilter={{
            display: true,
            name: 'filters.DeviceType'
          }}
          datePickerFilter={{
            display: true,
            name: 'filters.Date'
          }}
          singleselectFilter={{
            display: true,
            name: 'filters.DeviceStatus',
            options: selectOptions
          }}
        />
        <Table
          onDirectionChange={setSortingDirection}
          redirectFunction={(id) => history.push(`/passport/${id}/view`)}
          type="passports"
          setPage={setTablePage}
          rowsData={rows}
          page={page}
          pageSize={pageSize}
          pages={pages}
          showTimeIcon={true}
          showFixIcon={true}
          headerRow={['Название', 'Тип изделия', 'Дата завершения']}
          rowsKeys={{nameCol: 'model', typeCol: 'type', dateTimeCol: 'creation_time', id: 'internal_id'}}
        />
      </div>
    </div>
  );
}
