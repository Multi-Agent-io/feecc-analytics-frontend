import printBtn from '../../assets/print_btn.svg'

import classes from "./PrintButton.module.css" 

function PrintButton() {
  return(
    <button className={classes.button}  onClick = {()=> window.print()}><img src={printBtn} alt="Распечатать документ"/></button>
  )
}

export default PrintButton