import React, { useState, useEffect } from 'react';

import { history } from '../../store/main';

import ScanButton from '../../components/ScanButton/ScanButton';
import Search from '../../components/Search/Search';
import styles from './TechnicalControlDepartment.module.css';
import Filters from '../../components/Filters/Filters';
import SettingsButton from '../../components/SettingsButton/SettingsButton';
import { useDispatch, useSelector } from 'react-redux';
import { doGetProtocols } from '../../store/userActions';
import Table from '../../components/Table/Table';
import { getProtocols, getProtocolsNumber } from '../../store/selectors';

function TechnicalControlDepartment() {

  const dispatch = useDispatch()

  const [searchValue, setSearchValue] = useState('');
  const [filtersDisplay, changeFiltersDisplay] = useState(true);

  const [filtersValues, setFiltersValues] = useState({
    multiSelectType: [''],
    date: null,
    overwork: null,
    requiredFix: null,
    singleSelectType: 'Первая стадия испытаний пройдена'
  })
  const [pageSize, setPageSize] = useState(11);
  const [page, setPage] = useState(localStorage.getItem('protocolsTablePage') || 1)
  const [sortingDirection, setSortingDirection] = useState('asc');

  let rows = useSelector(getProtocols)?.toJS()
  let pages = Math.ceil(useSelector(getProtocolsNumber) / pageSize)

  const selectOptions = [
    {
      name: 'Первая стадия испытаний пройдена',
      value: 'Первая стадия испытаний пройдена',
      status: true
    },
    {
      name: 'Вторая стадия испытаний пройдена',
      value: 'Вторая стадия испытаний пройдена',
      status: false
    },
    {
      name: 'Протокол утверждён',
      value: 'Протокол утверждён',
      status: false
    }
  ];

  // ====== handler functions ======
  const goToProtocolHandler = (id) => {
    history.push(`/tcd/protocol/${id}`);
  };

  const setTablePage = (page) => {
    setPage(page)
    localStorage.setItem('protocolsTablePage', page)
  }
  const fetchProtocols = () => {
    doGetProtocols(dispatch, page, pageSize, null, null, filtersValues.singleSelectType, sortingDirection)
      .then()
  }

  const dropFilters = () => {
    setFiltersValues({
      multiSelectType: [''],
      date: null,
      overwork: null,
      requiredFix: null,
      singleSelectType: 'Первая стадия испытаний пройдена'
    })
  }

  // ====== useEffect ======
  useEffect(() => {
    fetchProtocols()
    if (page > pages && page !== 0) {
      setPage(page)
    }
  }, [filtersValues, page, sortingDirection])

  return (<div className={styles.pageWrapper}>
    <div className={styles.searchWrapper}>
      <ScanButton/>
      <Search value={searchValue} onChange={setSearchValue}/>
      <SettingsButton onClick={() => {
        changeFiltersDisplay(!filtersDisplay);
        filtersDisplay ? setPageSize(13) : setPageSize(11);
      }}/>
    </div>
    <div className={styles.contentWrapper}>
      <Filters
        onDrop={dropFilters}
        onChange={(value) => {
          setFiltersValues(value);
        }}
        toggle={filtersDisplay}
        multiselectFilter={{ display: false }}
        datePickerFilter={{ display: false }}
        singleselectFilter={{
          display: true,
          name: 'Статус протокола',
          options: [...selectOptions]
        }}
      />
      <Table
        onDirectionChange={setSortingDirection}
        redirectFunction={goToProtocolHandler}
        type="passports"
        setPage={setTablePage}
        rowsData={rows}
        page={page}
        pages={pages}
        pageSize={pageSize}
        showTimeIcon={false}
        showFixIcon={false}
        headerRow={['Название', 'Статус протокола', 'Дата создания']}
        rowsKeys={{nameCol: 'protocol_name', typeCol: 'status', dateTimeCol: 'creation_time', id: 'associated_unit_id'}}
      />
    </div>
  </div>);
}

export default TechnicalControlDepartment;
