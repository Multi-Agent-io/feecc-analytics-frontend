import Button from '../../components/Button/Button'
import PrintButton from "../../components/PrintButton/PrintButton"

import styles from './Protocol.module.css'

import ButtonBack from '../../components/ButtonBack/ButtonBack';
function Protocol(){

  
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <ButtonBack/>
        <div>
          <h1>ПРОТОКОЛ приемо-сдаточных испытаний №__-В</h1>
          <h2>Стойка эндоскопическая E-CART, Артикул S-02 (ТУ 32.50.50-206-89134710-2020)</h2>
          <h2>SN: 941619006-_______</h2>
        </div>
        <PrintButton/>
      </div>
      <div className={styles["grid-container"]}>
        <div>fgfg</div>
        <div>fgfg</div>
        <div>fgfg</div>
        <div>fgfg</div>
      </div>  
    </section>
  )
}

export default Protocol