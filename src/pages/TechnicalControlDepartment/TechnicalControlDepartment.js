import { useState, useEffect } from "react";

import { history } from "../../store/main";

import ScanButton from "../../components/ScanButton/ScanButton";
import Search from "../../components/Search/Search";
import SearchProtocol from "../../components/SearchProtocol/SearchProtocol";
import Button from "../../components/Button/Button";

import styles from "./TechnicalControlDepartment.module.css"


function TechnicalControlDepartment() {

    const [searchValue, setSearchValue] = useState('');
    const [protocols, setProtocols] = useState([]);
    const [filteredProtocols, setFilteredProtocols] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [statusOfProtocol, setStatusOfProtocol] = useState('Выберите из списка')
    
    const [filterTypes, setFilterTypes] = useState([])

    // ====== handler functions ======

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

    // ====== render functions ======

    const makeProtocolsTable = () => {
       return (
        <div className={`${styles["grid-table_body"]} ${styles["grid-table"]}`}>
           {
            filteredProtocols.map((protocol) => {
                const date = new Date(protocol.creation_time)
                const year = date.getFullYear();
                const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
                const day = (date.getDay() + 1) < 10 ? `0${date.getDay() + 1}` : date.getDay() + 1;
                return (
                     <>
                        <div 
                            className={styles["grid-table_body__name"]} 
                            onClick={goToProtocolHandler.bind(null, protocol.associated_unit_id)} 
                        >{protocol.protocol_name}</div>
                        <div>{protocol.status}</div>
                        <div>{`${year}.${month}.${day}`}</div>
                     </>
                )
            })
           }
        </div>
       )
    }

    // ====== useEffect ======

    useEffect(() => {
        setIsLoading(true)
        fetch("http://134.209.240.5:5002/api/v1/tcd/protocols", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then((res) => {
            console.log(res.data);
            setProtocols(res.data)
            setFilteredProtocols(res.data)
            setIsLoading(false)
        })

        fetch("http://134.209.240.5:5002/api/v1/tcd/protocols/types", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res)=> res.json())
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
        <div className={`${styles["grid-table_header"]} ${styles["grid-table"]}`}>
            <div>Название</div>
            <div>Состояние</div>
            <div>Время создания</div>
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