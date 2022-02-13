import { useState, useEffect } from "react";

import styles from './Protocol.module.css'

import PrintButton from "../../components/PrintButton/PrintButton"
import ButtonBack from '../../components/ButtonBack/ButtonBack';
import Button from '../../components/Button/Button'

function Protocol(){

  const [rowsArray, setRowsArray] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [pasportId, setPaportId] = useState('')

  useEffect(() => {

    setTimeout(() => {
      const dummyData = { // from server
        data:[
          ["Проверка сырья и материаловfffffffffffffffffffffffffffffffffffff", 3, null, false, false, false], // name:string, nominalValue:number, limitDeviation:any, 1st check:boolean, 2nd check:boolean, approve:boolean  
          ["Проверка плавности вращения колес стойки", 5, null, false, false, false],
          ["Наименование параметра (показателя)", 6, null, false, false, false],
          ["Проверка усилия, необходимого для включения/выключения тормоза колеса", 7, null, false, false, false],
          ["Проверка усилия, необходимого для перемещения стойки", 67, null, false, false, false],
          ["Проверка плавности и усилия перемещения лотков", 45, null, false, false, false],
          ["Проверка сырья и материалов", 3, null, false, false, false], // name:string, nominalValue:number, limitDeviation:any, 1st check:boolean, 2nd check:boolean, approve:boolean  
          ["Проверка плавности вращения колес стойки", 5, null, false, false, false],
          ["Наименование параметра (показателя)", 6, null, false, false, false],
          ["Проверка усилия, необходимого для включения/выключения тормоза колеса", 7, null, false, false, false],
          ["Проверка усилия, необходимого для перемещения стойки", 67, null, false, false, false],
          ["Проверка плавности и усилия перемещения лотков", 45, null, false, false, false],
          ["Проверка плавности вращения колес стойки", 5, null, false, false, false],
          ["Наименование параметра (показателя)", 6, null, false, false, false],
          ["Проверка усилия, необходимого для включения/выключения тормоза колеса", 7, null, false, false, false],
          ["Проверка усилия, необходимого для перемещения стойки", 67, null, false, false, false],
          ["Проверка плавности и усилия перемещения лотков", 45, null, false, false, false],
        ],
        state: true,
        pasport_id: 2144683857150,
      }

      setRowsArray(dummyData.data)
      setIsLoading(true)
      setPaportId(dummyData.pasport_id)
      
    }, 500)
    
  }, [])

  useEffect(() => {
    const allCheckBox = document.querySelectorAll(`div > input[type=checkbox]`)
    const allCheckBoxArray = Array.from(allCheckBox)

    for (let i = 0; i < allCheckBoxArray.length; i++) {

      if(allCheckBoxArray[i].offsetTop > 600){
        allCheckBoxArray[i].parentElement.classList.add(styles.pageBreaker)
        break
      }
    }

    return () => window.onbeforeunload = () => null // clear event listener

  },[isLoading])

  const makeGridTable = (arrayItems) => {

    const jsxArray = arrayItems.map((row, index) => {
      const currRow = []
      for (let j = 0; j < row.length; j++) {
        if (j < 3) {
          currRow.push(<div key={`${index} ${j}`} value = {row[j]}>{row[j]}</div>)
        } else if(j === row.length - 1) {
          currRow.push(
            <div key ={`${index} ${j}`} className={styles["custom_checkbox"]}>
              <input  type="checkbox" placeholder="Введите значение" id = {`${index} ${j}`}/>
              <label htmlFor ={`${index} ${j}`}>Проверено</label>
            </div>
            )
        } else {
          currRow.push(
            <input 
              key ={`${index} ${j}`} 
              type='text' 
              placeholder="Введите значение" 
              id = {`${index} ${j}`}
            />
          )
        }
      }
      return currRow
    })

    return jsxArray
  }
  
  const inputDataHandler = (event) => {
      window.onbeforeunload = () => true // defense from user's reload

      const targetInput = event.target;
      const targetValue = targetInput.type === "checkbox" ? targetInput.checked : targetInput.value;
      const [i, j] = targetInput.id.split(" ");

      const newState = JSON.parse(JSON.stringify(rowsArray));
      newState[i][j] = targetValue;

      setRowsArray(newState)  
  }
  const submitDataHandler = () => {

    let allFieldChecked = true;
    
    for (let i = 0; i < rowsArray.length - 1; i++) {
      if(rowsArray[i][rowsArray[i].length - 1] === false) {
        allFieldChecked = false;
      }
    }

    if(!allFieldChecked){
      allFieldChecked = window.confirm("Внимание вы не проверили все поля! Вы хотите продолжить?")
    } 

    if(allFieldChecked){
      console.log("fetch");
    }

  }

  const goToPasportHandler = () => {
    window.location = `/passport/${pasportId}`
  }

  const checkAllHandler = () => {
    const allCheckBox = document.querySelectorAll(`div > input[type=checkbox]`)
    

  }

  const isSuperEngineer = false; // repalace with real logic

  

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <ButtonBack/>
        <div>
          <h1>ПРОТОКОЛ приемо-сдаточных испытаний №__-В</h1>
          <h2>Стойка эндоскопическая E-CART, Артикул S-02 (ТУ 32.50.50-206-89134710-2020)</h2>
          <h2>SN: 941619006-_______</h2>
        </div>
        <PrintButton disabled={!isLoading} />
      </div>
      
      <div className={`${styles["grid-container_header"]} ${styles.grid}`}>
        <div className={styles["col-1"]}>Наименование параметра (показателя)</div>
        <div className={styles["col-2"]}>Значение параметра</div>
        <div className={styles["col-3"]}>Номинальное значение</div>
        <div className={styles["col-4"]}>Предельное отклонение</div>
        <div className={styles["col-5"]}>Первичное испытание</div>
        <div className={styles["col-6"]}>Вторичное испытание</div>

        {!isSuperEngineer && <div className={styles["col-check"]}>Проверено </div> } {/* only for junior engineer */}
        {/* {!isSuperEngineer &&<div className={styles["col-check"]}>Доработка </div>} only for junior engineer */}

      </div>
      <div onChange={inputDataHandler} className={`${styles["grid-container_body"]} ${styles.grid}`}>
        {isLoading && makeGridTable(rowsArray)}
      </div>
      <div className={styles["btns-section"]}>
        {isLoading && <Button variant = "clear" onClick = {goToPasportHandler}>Открыть паспорт</Button>}
        <div>
          {isLoading && <Button onClick = {checkAllHandler}>Отметить всё</Button>}
          {isLoading && <Button onClick = {submitDataHandler}>Отправить</Button>}
        </div>
       </div>
       {!isLoading && <h1>Идёт загрузка...</h1>}
    </section>
  )
}

export default Protocol