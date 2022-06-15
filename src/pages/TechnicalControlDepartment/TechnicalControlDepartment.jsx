import React, { useState, useEffect } from 'react';

// import { history } from '../../store/main';

import {
  ScanButton, Search, SearchProtocol, Button,
} from '../../components';

import useHttp from '../../hooks/use-http';

import styles from './TechnicalControlDepartment.module.css';
import conf from '../../config.json';

function TechnicalControlDepartment() {
  const [searchValue, setSearchValue] = useState('');
  const [protocols, setProtocols] = useState([]);
  const [filteredProtocols, setFilteredProtocols] = useState([]);
  const [statusOfProtocol, setStatusOfProtocol] = useState('Выберите из списка');
  const [filterTypes, setFilterTypes] = useState([]);

  const { isLoading, sendRequest } = useHttp();
  const authorizationHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  // ====== handler functions ======

  // const goToProtocolHandler = (id) => {
  //   history.push(`/tcd/protocol/${id}`);
  // };

  const changeFilterProtocolsStatusHandler = (event) => {
    setStatusOfProtocol(event.target.value);
  };

  const cleanAllFilters = () => {
    setSearchValue('');
    setStatusOfProtocol('Выберите из списка');
  };

  // ====== render functions ======

  const makeProtocolsTable = () => (
    <table className={styles.tcd_table}>
      <thead className={styles.tcd_thead}>
        <tr className={styles.tcd_tr}>
          <td className={styles.tcd_td}>Название</td>
          <td className={styles.tcd_td}>Состояние</td>
          <td className={styles.tcd_td}>Время создания</td>
        </tr>
      </thead>
      <tbody className={styles.tcd_tbody}>
        {filteredProtocols.map((protocol) => {
          const date = new Date(protocol.creation_time);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
          const day = (date.getDate() + 1) < 10 ? `0${date.getDate() + 1}` : date.getDate() + 1;
          return (
            <tr className={styles.tcd_tr}>
              <td className={`${styles.tcd_td} ${styles.table_item_header}`}>
                <a
                  href={`/tcd/protocol/${protocol.associated_unit_id}`}
                  type="link"
                >
                  {protocol.protocol_name}
                </a>
              </td>
              <td className={styles.tcd_td}>{protocol.status}</td>
              <td className={styles.tcd_td}>{`${year}.${month}.${day}`}</td>
            </tr>
          );
        })}
      </tbody>

    </table>
  );

  // ====== useEffect ======

  useEffect(() => {
    sendRequest({
      url: `${conf.base_url}/api/v1/tcd/protocols`,
    })
      .then(({ data }) => {
        setProtocols(data);
        setFilteredProtocols(data);
      });

    sendRequest({
      url: `${conf.base_url}/api/v1/tcd/protocols/types`,
      headers: authorizationHeaders,
    })
      .then((res) => {
        setFilterTypes(res.data);
      });
  }, []);

  // filter logic
  useEffect(() => {
    if (searchValue.length === 0 && statusOfProtocol.length === 0) {
      setFilteredProtocols(protocols.slice());
    } else {
      setFilteredProtocols(
        protocols.map((protocol) => (
          protocol.protocol_name.toLowerCase().includes(searchValue.toLowerCase())
          && (statusOfProtocol === 'Выберите из списка' ? true : protocol.status === statusOfProtocol)
        )),
      );
    }
  }, [searchValue, statusOfProtocol]);

  return (
    <section className={styles.pageWrapper}>
      <div className={styles.searchWrapper}>
        <ScanButton />
        <Search value={searchValue} onChange={setSearchValue} />
      </div>
      <div className={styles.filters}>
        <div className={styles.filters__main}>
          <SearchProtocol
            label="Статус"
            types={filterTypes}
            value={statusOfProtocol}
            onChange={changeFilterProtocolsStatusHandler}
          />
        </div>
        <Button onClick={cleanAllFilters} variant="clear">Очистить фильтры</Button>
      </div>
      {isLoading ? (
        <h1>Идёт загрузка...</h1>
      ) : (
        makeProtocolsTable()
      )}
    </section>
  );
}

export default TechnicalControlDepartment;
