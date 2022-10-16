import { useState, useEffect } from "react";

import styles from './Protocol.module.css'

import { history } from "../../store/main";
import { useSelector } from "react-redux";
import { getRule } from "../../store/selectors";

import PrintButton from "../../components/PrintButton/PrintButton"
import ButtonBack from '../../components/ButtonBack/ButtonBack';
import Button from '../../components/Button/Button'
import conf from '../../config.json'

function Protocol(){

  const [protocol, setProtocol] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [protocolId, setProtocolId] = useState('');
  const [isSuperEngineer, setSuperEngineer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  // const {isLoading, error, sendRequest} = useHttp() ......needs to be finalized
  // const authorizationHeaders = {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${localStorage.getItem('token')}`
  // }

  const superEngineer = useSelector(getRule) === undefined ? true : false
  const internal_id = history.location.pathname.split('/')[3]

  // ======== all handlers ========
  const inputDataHandler = (event) => {
      window.onbeforeunload = () => true // defense from user's reload

      const targetInput = event.target;
      const targetValue = targetInput.type === "checkbox" ? targetInput.checked : targetInput.value;
      const [index, place] = targetInput.id.split(" ");


      const newState = JSON.parse(JSON.stringify(protocol));
      const rowsArray = newState.rows;

      rowsArray[index][place] = targetValue;

      setProtocol(newState)
  }

  const serialNumberHandler = (event) => {
    setSerialNumber(event.target.value)
  }
  const submitDataHandler = () => {

    const rowsArray = protocol.rows

    let allFieldChecked = true;

    for (let i = 0; i < rowsArray.length - 1; i++) {
      if(rowsArray[i].checked === false) {
        allFieldChecked = false;
      }
    }

    if(!allFieldChecked){
      allFieldChecked = window.confirm("Внимание вы не проверили все поля! Вы хотите продолжить?") // should be changed to a modal window
    }

    if(!serialNumber){
      alert("Внимание вы не заполнили серийный номер!")
    }

    if(allFieldChecked && serialNumber){
      console.log(protocol);

      const serialBody = `serial_number=${serialNumber}`
      fetch(`${conf.base_url}/api/v1/passports/${internal_id}/serial?${serialBody}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        // body: serialBody, через body, по невероятным причинам, не работает
      })
      .then((res)=> {
        res.ok ? alert("Серийный номер отправлен!") : alert("Что-то пошло не так серийного номера!")
      })

      fetch(`${conf.base_url}/api/v1/tcd/protocols/${internal_id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(protocol)
      })
      .then((res)=> {
        res.ok ? alert("Протокол успешно отправлен!") : alert("Что-то пошло не так c отправкой протокола!");
        if(res.status === 403) {
          alert("У вас недостаточно прав для отправки протокола!")
        }
      }).then(()=> {
        window.onbeforeunload = () => null;
        history.goBack()
      })
    }

  }

  const goToPassportHandler = () => {
    history.push(`/passport/${protocolId}/edit`)
  }

  const checkAllHandler = () => {
    window.onbeforeunload = () => true // defense from user's reload

    const allCheckBox = document.querySelectorAll(`div > input[type=checkbox]`)
    const newState = JSON.parse(JSON.stringify(protocol));

    const rowsArray = newState.rows

    for (let i = 0; i < allCheckBox.length; i++) {
      allCheckBox[i].checked = true;

      const targetValue =  allCheckBox[i].checked
      const [row, place] = allCheckBox[i].id.split(" ");

      rowsArray[row][place] = targetValue;

    }
    setProtocol(newState)
  }

  // ======== make function for render ========
  const makeButtonSection = () => {
    return (
      <div className={styles["btns-section"]}>
        <Button variant = "clear" onClick = {goToPassportHandler}>Открыть паспорт</Button>
        <div>
          {!isSuperEngineer && protocol.status !== "Протокол утверждён" &&
            <>
              <Button onClick = {checkAllHandler}>Отметить всё</Button>
              <Button onClick = {submitDataHandler}>{protocol.status === "Вторая стадия испытаний пройдена" ? "Сохранить" : "Подтвердить и отправить"}</Button>
            </>
          }
          {isSuperEngineer &&
            <Button>Подтвердить</Button>
          }
        </div>
       </div>
    )
  }

  const makeGridTable = (arrayItems) => {
    const jsxArray = arrayItems.map((row, index) => {
      const {name = "Без имени", value = "", deviation = "", test1 = "", test2 = "", checked = false} = row;
      return (
        <>
          <div key={`${index} name`}>{name}</div>
          <div key={`${index} value`}>{value}</div>
          <div key={`${index} deviation`}>{deviation}</div>
          <input
              key ={`${index} test1`}
              type='text'
              placeholder={"Введите значение"}
              id = {`${index} test1`}
              value={test1}
              disabled={protocol.status === "Протокол утверждён"}
          />
          <input
              key ={`${index} test2`}
              type='text'
              placeholder={"Введите значение"}
              id = {`${index} test2`}
              value={test2}
              disabled={protocol.status === "Протокол утверждён"}
          />
          <div key ={`${index} checked`}>
              <input
                defaultChecked={checked}
                type="checkbox"
                id = {`${index} checked`}
                disabled={protocol.status === "Протокол утверждён"}
              />
              <label htmlFor ={`${index} checked`}>Проверено</label>
          </div>
        </>
      )

    })

    return (
      <div onChange={inputDataHandler} className={`${styles["grid-container_body"]} ${styles.grid}`}>
        {jsxArray}
      </div>
    )
  }

  // ======== use effect ========
  useEffect(() => {

    setIsLoading(true) // start loading

    fetch(`${conf.base_url}/api/v1/tcd/protocols/${internal_id}`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    })
    .then(res => {
        return res.json()
    })
    .then(res => {
      console.log(res);
      if(res.detail !== "Success")
        alert("Error reading protocol. No schema for this product")
      else {
        setProtocol(res.protocol)
        setProtocolId(internal_id)
        setSuperEngineer(superEngineer)
        setSerialNumber(res.serial_number)
        setIsLoading(false)
      }
    })

    return () => window.onbeforeunload = () => null // clear event listener for defence from reloading (from checkAllHandler)

  }, [])


  return (
    isLoading ? (
    <h1 className={styles.loading} >Идёт загрузка...</h1>
    ) : (
      <section className={`${styles.section} ${isSuperEngineer === true ? styles["super-engineer"] : null}`} >
        <div className={styles.header}>
          <ButtonBack/>
          <div>
            <h1>ПРОТОКОЛ приемо-сдаточных испытаний №__-В</h1>
            <h2 className={styles["protocol_name"]}>{protocol.protocol_name}</h2>
            <h2>
              SN: {protocol.default_serial_number !== null ? protocol.default_serial_number : '941619006-'}
              <input
                onChange={serialNumberHandler}
                value={serialNumber}
                className = {styles["serial_number"]}
                placeholder = "000000"
              >
              </input>
            </h2>
          </div>
          <PrintButton disabled={isLoading} />
        </div>

        <div className={`${styles["grid-container_header"]} ${styles.grid}`}>
          <div className={styles["col-1"]}>Наименование параметра (показателя)</div>
          <div className={styles["col-2"]}>Значение параметра</div>
          <div className={styles["col-3"]}>Номинальное значение</div>
          <div className={styles["col-4"]}>Предельное отклонение</div>
          <div className={styles["col-5"]}>Первичное испытание</div>
          <div className={styles["col-6"]}>Вторичное испытание</div>
          <div className={styles["col-check"]}>Проверено </div>
        </div>

        {makeGridTable(protocol.rows)}

        {makeButtonSection()}

      </section>)
  )
}

export default Protocol
