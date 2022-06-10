import { useState, useEffect } from "react";

import { history } from "../../store/main";

import {ScanButton, Search, SearchProtocol, Button} from '../../components'

import useHttp from "../../hooks/use-http";

import leftArrow from '../../assets/arrrow_left.svg'
import rightArrow from '../../assets/arrow_right.svg'
import styles from "./TechnicalControlDepartment.module.css"
import conf from '../../config.json'


function TechnicalControlDepartment() {

    const [searchValue, setSearchValue] = useState('');
    const [protocols, setProtocols] = useState([]);
    const [filteredProtocols, setFilteredProtocols] = useState([]);
    const [statusOfProtocol, setStatusOfProtocol] = useState('Выберите из списка')
    const [filterTypes, setFilterTypes] = useState([])
    const [pageNumber, setPageNumber] = useState(1);

    const {isLoading, error, sendRequest} = useHttp()
    const authorizationHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }

    // ====== handler functions ======

    const setPage = (page) => {
        pageNumber && pageNumber.setPageNumber(page)
    }

    const decreasePage = () => {
        if (pageNumber > 1)
        setPageNumber(parseInt(pageNumber)-1)
    }

    const increasePage = () => {
        setPageNumber(parseInt(pageNumber)+1)
    }

    const goToProtocolHandler = (id) => {
        history.push(`/tcd/protocol/${id}`)
    }

    const changeFilterProtocolsStatusHandler = (event) => {
        setStatusOfProtocol(event.target.value)
    }

    const cleanAllFilters = () => {
        setSearchValue('')
        setStatusOfProtocol('Выберите из списка')
    }

    const onInputChange = (e) => {
        let value = e.target.value
        if (typeof parseInt(value) === "number") {
            if (value === '')
                setPageNumber(1)
            else
                setPageNumber(parseInt(e.target.value));
            sendRequest()
        }
    }

    // ====== render functions ======

    const makeProtocolsTable = () => {
       return (
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
              const date = new Date(protocol.creation_time)
              const year = date.getFullYear();
              const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
              const day = (date.getDate() + 1) < 10 ? `0${date.getDate() + 1}` : date.getDate() + 1;
              return (
                <tr className={styles.tcd_tr}>
                  <td
                    className={`${styles.tcd_td} ${styles.table_item_header}`}
                    onClick={() => goToProtocolHandler(protocol.associated_unit_id)}
                  >{protocol.protocol_name}</td>
                  <td className={styles.tcd_td}>{protocol.status}</td>
                  <td className={styles.tcd_td}>{`${year}.${month}.${day}`}</td>
                </tr>
              )
            })}
          </tbody>
          <div className={styles.pageSelectorWrapper}>
                <div onClick={decreasePage} className={styles.arrows} >
                    <img src={leftArrow} alt="Previous page arrow"/>
                </div>
                <input onChange={onInputChange} className={styles.outlinedPageNumberWrapper} value={pageNumber}/>
                <div onClick={increasePage} className={styles.arrows}>
                    <img src={rightArrow} alt="Next page arrow"/>
                </div>
            </div>
        </table>
       )
    }

    // ====== useEffect ======

    useEffect(() => {
        sendRequest({
            url: `${conf.base_url}/api/v1/tcd/protocols?items=7&page=${pageNumber}`,
            // body: {
            //     items: 10,
            //     page: 1,
            // }
        })
        .then(({data}) => {
            setProtocols(data)
            setFilteredProtocols(data)
        })

        sendRequest({
            url: `${conf.base_url}/api/v1/tcd/protocols/types`,
            headers: authorizationHeaders,
        })
        .then(res => {
            setFilterTypes(res.data)
        })

    }, [])

    // filter logic
    useEffect(() => {
       if(searchValue.length === 0 && statusOfProtocol.length === 0){
           setFilteredProtocols(protocols.slice())
       } else {
           setFilteredProtocols(
               protocols.filter((protocol) => {
               return (
                   protocol.protocol_name.toLowerCase().includes(searchValue.toLowerCase()) &&
                   (statusOfProtocol === "Выберите из списка" ? true : protocol.status === statusOfProtocol)
               )
           }))
       }
       
    }, [searchValue, statusOfProtocol])

  return (
    <section className={styles.pageWrapper}>
        <div className={styles.searchWrapper}>
            <ScanButton/>
            <Search value={searchValue} onChange = {setSearchValue} />
        </div>
        <div className={styles.filters}>
            <div className={styles.filters__main} >
                <SearchProtocol 
                    label ={"Статус"} 
                    types ={filterTypes} 
                    value ={statusOfProtocol} 
                    onChange ={changeFilterProtocolsStatusHandler}
                />
            </div>
            <Button onClick ={cleanAllFilters} variant ="clear">Очистить фильтры</Button>
        </div>
        {isLoading ? (
            <h1>Идёт загрузка...</h1>
        ) : (
            makeProtocolsTable()  
        )}
    </section>
  )
}

export default TechnicalControlDepartment