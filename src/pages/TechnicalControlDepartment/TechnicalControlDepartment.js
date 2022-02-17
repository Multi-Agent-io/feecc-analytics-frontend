import { useState, useEffect } from "react";

import { history } from "../../store/main";

import ScanButton from "../../components/ScanButton/ScanButton";
import Search from "../../components/Search/Search";
import SearchProtocol from "../../components/SearchProtocolTypes/SearchProtocol";
import Button from "../../components/Button/Button";

import styles from "./TechnicalControlDepartment.module.css"


function TechnicalControlDepartment() {

    const [searchValue, setSearchValue] = useState('');
    const [protocols, setProtocols] = useState([]);
    const [filteredProtocols, setFilteredProtocols] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [typeOfProtocol, setTypeOfProtocol] = useState('Выберите из списка')
    const [statusOfProtocol, setStatusOfProtocol] = useState('Выберите из списка')
    
    const dummyData = [
        {
            id: 1, // device protocol id
            name: "1name", // protocol name or name of device
            status: "Заполнен и не подтверждён", //
            type: "Помпа", // type of device
            time: "00.00.00"
        },
        {
            id: 2,
            name: "2name",
            status: "status",
            type: "Помпа",
            time: "00.00.00"
        },
        {
            id: 3,
            name: "3name",
            status: "status",
            type: "type2",
            time: "00.00.00"
        },
        {
            id: 4,
            name: "4name",
            status: "status",
            type: "type2",
            time: "00.00.00"
        },
        {
            id: 5,
            name: "5name",
            status: "Заполнен и подтверждён",
            type: "Стойка",
            time: "00.00.00"
        },
        {
            id: 6,
            name: "6name",
            status: "status",
            type: "type3",
            time: "00.00.00"
        },
        {
            id: 7,
            name: "7name",
            status: "Заполнен и подтверждён",
            type: "type",
            time: "00.00.00"
        },
        {
            id: 8,
            name: "7name",
            status: "Заполнен и не подтверждён",
            type: "Адаптер",
            time: "00.00.00"
        },
        {
            id: 9,
            name: "7name",
            status: "Заполнен и подтверждён",
            type: "Адаптер",
            time: "00.00.00"
        },
        {
            id: 9,
            name: "7name",
            status: "Заполнен и не подтверждён",
            type: "type",
            time: "00.00.00"
        },
        {
            id: 9,
            name: "7name",
            status: "Заполнен и отправлен на доработку",
            type: "type",
            time: "00.00.00"
        },
        {
            id: 9,
            name: "7name",
            status: "Заполнен и отправлен на доработку",
            type: "Стойка",
            time: "00.00.00"
        },

    ]

    const typesStatus = ['Заполнен и не подтверждён', "Заполнен и отправлен на доработку", "Заполнен и подтверждён"];
    const typesType = ['Помпа', "Адаптер", "Стойка"];

    // ====== handler functions ======

    const goToProtocolHandler = (id) => {
        history.push(`/tcd/protocol/${id}`)
    }

    const changeFilterProtocolsTypeHandler = (event) => {
        setTypeOfProtocol(event.target.value)
    }

    const changeFilterProtocolsStatusHandler = (event) => {
        setStatusOfProtocol(event.target.value)
    }

    const cleanAllFilters = () => {
        setSearchValue('')
        setStatusOfProtocol('Выберите из списка')
        setTypeOfProtocol('Выберите из списка')
    }

    // ====== render functions ======

    const makeProtocolsTable = () => {
       return (
        <div className={`${styles["grid-table_body"]} ${styles["grid-table"]}`}>
           {
            filteredProtocols.map((protocol) => {
                return (
                     <>
                        <div onClick={goToProtocolHandler.bind(null, protocol.id)} >{protocol.name}</div>
                        <div>{protocol.type}</div>
                        <div>{protocol.status}</div>
                        <div>{protocol.time}</div>
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
        .then(res => {
            setProtocols(dummyData)
            setFilteredProtocols(dummyData)
            setIsLoading(false)
        })

    }, [])

    // filter logic
    useEffect(() => {
       if(searchValue.length === 0 && typeOfProtocol.length === 0){
           setFilteredProtocols(protocols.slice())
       } else {
           setFilteredProtocols(
               protocols.filter((protocol) => {
               return (
                   protocol.name.includes(searchValue) &&
                   (typeOfProtocol === "Выберите из списка" ? true : protocol.type === typeOfProtocol) &&  // check if value is default
                   (statusOfProtocol === "Выберите из списка" ? true : protocol.status === statusOfProtocol)
               )
           }))
       }
       
    }, [searchValue, typeOfProtocol, statusOfProtocol])

  return (
    <section className={styles.pageWrapper}>
        <div className={styles.searchWrapper}>
            <ScanButton/>
            <Search value={searchValue} onChange = {setSearchValue} />
            
        </div>
        <div className={styles.filters}>
            <div className={styles.filters__main} >
                <SearchProtocol 
                    label = {"Тип устройства"} 
                    types ={typesType} 
                    value ={typeOfProtocol} 
                    onChange ={changeFilterProtocolsTypeHandler}
                />
                <SearchProtocol 
                    label ={"Статус"} 
                    types ={typesStatus} 
                    value ={statusOfProtocol} 
                    onChange ={changeFilterProtocolsStatusHandler}
                />
            </div>
            <Button onClick ={cleanAllFilters} variant ="clear">Очистить фильтры</Button>
        </div>
        <div className={`${styles["grid-table_header"]} ${styles["grid-table"]}`}>
            <div>Название</div>
            <div>Тип изделия</div>
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