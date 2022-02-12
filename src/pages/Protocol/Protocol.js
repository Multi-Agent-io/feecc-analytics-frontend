import { useState, useEffect } from "react";

import styles from './Protocol.module.css'

import PrintButton from "../../components/PrintButton/PrintButton"
import ButtonBack from '../../components/ButtonBack/ButtonBack';
import Button from '../../components/Button/Button'

function Protocol(){

  const [protocolsArray, setProtocols] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)

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
      }
      setProtocols(dummyData.data)
      setIsLoading(true)
      
    }, 500)
    
  }, [])

  useEffect(() => {
    const allDivs = document.querySelectorAll(`div > input[type=checkbox]`)
    const allDivsArray = Array.from(allDivs)
    console.log(allDivsArray);

    for (let i = 0; i < allDivsArray.length; i++) {

      if(allDivsArray[i].offsetTop > 600){
        console.log(allDivsArray[i].parentElement);
        allDivsArray[i].parentElement.classList.add(styles.pageBreaker)
        break
      }
    }

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
              <label htmlFor ={`${index} ${j}`}>Добавить на добработку</label>
            </div>
            )
        } else {
          currRow.push(<input key ={`${index} ${j}`} type='text' placeholder="Введите значение" id = {`${index} ${j}`}/>)
        }
      }
      return currRow
    })

    return jsxArray
  }
  
  const inputDataHandler = (event) => {
      const targetInput = event.target;
      const targetValue = targetInput.type === "checkbox" ? targetInput.checked : targetInput.value;
      const [i, j] = targetInput.id.split(" ");

      const newState = JSON.parse(JSON.stringify(protocolsArray));
      newState[i][j] = targetValue;

      setProtocols(newState)  
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

        {isSuperEngineer && <div className={styles["col-check"]}>Проверено </div> } {/* only for super engineer */}
        {!isSuperEngineer &&<div className={styles["col-check"]}>Доработка </div>} {/* only for junior engineer */}

      </div>
      <div onChange={inputDataHandler} className={`${styles["grid-container_body"]} ${styles.grid}`}>
        {isLoading && makeGridTable(protocolsArray)}
      </div>
       {isLoading && <Button>Отправить</Button>}

       {!isLoading && <h1>Идёт загрузка...</h1>}
    </section>
  )
}

export default Protocol