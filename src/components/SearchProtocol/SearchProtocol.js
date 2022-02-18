
import arrow_down from "../../assets/arrrow_left.svg"

import classes from "./SearchProtocol.module.css"

function SearchProtocol(props) {
  

  const [optionsArray, label] = [props.types, props.label]

  return (
    <div className={classes.container}>
      <h2>{label}</h2>
      <select 
        defaultValue={props.value}
        value={props.value}
        className={classes.select} 
        onChange={props.onChange}
      >
        <option disabled={true}>Выберите из списка</option>
        {optionsArray.map((type, index)=> {
          return <option key={index}>{type}</option>
        })}
      </select>
      <img id="arrow-select" className={classes.arrow} src={arrow_down}/>
    </div>
  )
}

export default SearchProtocol