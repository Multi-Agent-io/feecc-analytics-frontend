import arrowLeft from "../../assets/arrrow_left.svg"
import {history} from "../../store/main";

import styles from "./ButtonBack.module.css"

function ButtonBack(props){

  return <button 
            onClick={() => history.goBack() } 
            className ={`${styles["btn-back"]} ${props.classes}`}
          >
            <img src={arrowLeft}></img>
          </button>
}

export default ButtonBack