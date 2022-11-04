import React, { useEffect } from 'react';
import printBtn from '../../assets/print_btn.svg'

import classes from "./PrintButton.module.css" 

function PrintButton(props) {

  useEffect(() => {
    if (props.afterPrintAction) window.onafterprint = props.afterPrintAction
  }, [])
  return(
    <button {...props} className={classes.button} onClick = {() => {
      if (props.beforePrintAction) props.beforePrintAction()
      setTimeout(() => {
      window.print()
      })
    }}><img src={printBtn} alt="Распечатать документ"/></button>
  )
}

export default PrintButton