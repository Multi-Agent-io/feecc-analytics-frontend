import { useState, useEffect } from "react";

import { history } from "../../store/main";

import ScanButton from "../../components/ScanButton/ScanButton";
import Search from "../../components/Search/Search";

import styles from "./TechnicalControlDepartment.module.css"


function TechnicalControlDepartment() {

    const [searchValue, setSearchValue] = useState('');
    const [protocols, setProtocols] = useState([]);
    const [filteredProtocols, setFilteredProtocols] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    
    const dummyData = [
        {
            id: 1, // device protocol id
            name: "1name", // protocol name or name of device
            status: "status", //
            type: "type", // type of device
            time: "00.00.00"
        },
        {
            id: 2,
            name: "2name",
            status: "status",
            type: "type",
            time: "00.00.00"
        },
        {
            id: 3,
            name: "3name",
            status: "status",
            type: "type",
            time: "00.00.00"
        },
        {
            id: 4,
            name: "4name",
            status: "status",
            type: "type",
            time: "00.00.00"
        },
        {
            id: 5,
            name: "5name",
            status: "status",
            type: "type",
            time: "00.00.00"
        },
        {
            id: 6,
            name: "6name",
            status: "status",
            type: "type",
            time: "00.00.00"
        },
        {
            id: 7,
            name: "7name",
            status: "status",
            type: "type",
            time: "00.00.00"
        },


    ]

    // ====== handler functions ======

    const goToProtocolHandler = (id) => {
        history.push(`/tcd/protocol/${id}`)
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
        fetch("http://analytics.netmvas.com:5002/api/v1/tcd/protocols", {
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

     },[])

     useEffect(() => {
        if(searchValue.length === 0){
            setFilteredProtocols(protocols.slice())
        } else {
            console.log(1);
            setFilteredProtocols(
                protocols.filter((protocol) => {
                return protocol.name.includes(searchValue)
            }))
        }
        
    }, [searchValue])

  return (
    <section className={styles.pageWrapper}>
        <div className={styles.searchWrapper}>
            <ScanButton/>
            <Search value={searchValue} onChange = {setSearchValue} />
        </div>
        <div className={`${styles["grid-table_header"]} ${styles["grid-table"]}`}>
            <div>Название</div>
            <div>Состояние</div>
            <div>Тип изделия</div>
            <div>Время создания</div>
        </div>
        {isLoading ? (
            <h1>Идёт загрузка</h1>
        ) : (
            makeProtocolsTable()  
        )}
    </section>
  )
}

export default TechnicalControlDepartment