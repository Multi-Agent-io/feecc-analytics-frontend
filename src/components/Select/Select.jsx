import React, {useEffect, useState} from 'react'
import styles from'./Select.module.css'
import Checkbox from '../Checkbox/Checkbox'
import arrowDownIcon from '../../assets/arrow_down.svg'
import clsx from "clsx";
import {useTranslation} from "react-i18next";

export default function Select (props) {

  let [checkboxes, setCheckboxes] = useState([])
  let [selectStatus, toggleSelect] = useState(false)
  let [selectedElement, setSelectedElement] = useState(props.options[0].name)
  let {t} = useTranslation()

  const updateCheckbox = (index) => {
    let arr = [...checkboxes]
    arr.map((item, innerIndex) => {
      if(index === innerIndex) {
        item.state = true
        setSelectedElement(item.name)
      } else
        item.state = false
      return item
    })
    setCheckboxes(arr)
    props.onChange && props.onChange({name: checkboxes[index].name, value: checkboxes[index].value})
  }

  useEffect(() => {
    if(!props.type) {
      setSelectedElement(t('filters.ChooseFromList'));
      checkboxes.map(item => {
        item.state = false
      })
    }
  }, [props.type])

  useEffect(() => {
    setCheckboxes(props.options);
    setTimeout(() => {
      if (checkboxes[0] !== undefined && checkboxes[0].state === true) {
        setSelectedElement(checkboxes[0].name);
      } else {
        setSelectedElement(t('filters.ChooseFromList'));
      }
    }, 300)
  }, [])

  return (
    <div className={clsx(styles.selectWrapper, {[styles.selectWrapperActive]: selectStatus})}>
      <ul className={styles.contentWrapper}>
        <div
          onClick={() => toggleSelect(!selectStatus)}
          className={clsx(styles.selectedContent, {[styles.selectedContentActive]: selectStatus})}>
          <div className={styles.selectedContentText}>{selectedElement}</div>
          <img className={clsx({[styles.rotatedArrow]: selectStatus})} src={arrowDownIcon} alt="Down arrow icon"/>
        </div>
        <div className={clsx(styles.checkboxesWrapper, {[styles.hidden]: !selectStatus})}>
          {checkboxes?.map((item, index) => {
            return (
              <div key={index + item.name + item.value}>
                <Checkbox checked={item.state} onChange={() => updateCheckbox(index)} variant="small" >{item.name}</Checkbox>
              </div>
            )
          })}
        </div>
      </ul>
    </div>
  )
}
