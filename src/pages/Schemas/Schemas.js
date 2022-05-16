import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { doGetSchemas } from "../../store/userActions";
import { useTranslation } from 'react-i18next'
import { Search, SelectMultiple } from '../../components'
import styles from './Schemas.module.css'
import { getSchemas } from "../../store/selectors";
// import useHttp from "../../hooks/use-http";
import { history } from "../../store/main";

import arrowButton from '../../assets/next.png'

export default function Schemas(props) {

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const schemas = useSelector((state) => getSchemas(state))
  const [schemasTree, setSchemasTree] = useState([])
  const [loading, setLoading] = useState(true) // TODO implement loading animation

  const options = [{state: false, name: "Type 1"}, {state: false, name: "Type 2"}, {
    state: false,
    name: "Type 3"
  }, {state: false, name: "Type 4"},]

  useEffect(() => {
    doGetSchemas(dispatch).then((res) => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let tree = schemas.filter((schema) => schema.parent_schema_id === null)
    tree.forEach((schema) => schema['innerSchemas'] = schemas.filter((item) => item.parent_schema_id === schema.schema_id))
    console.log('New schemas tree', tree)
    setSchemasTree(tree)
  }, [schemas])

  let updateTree = (newItem, id) => {
    let arr = schemasTree
    arr.map((item, index) => {
      if (index === id) return newItem
      else return item
    })
    setSchemasTree([...arr])
  }

  return (<div className={ styles.contentWrapper }>
    <div className={ styles.searchWrapper }>
      <Search placeholder={ "Enter schema name" }/>
    </div>
    <div className={ styles.filtersWrapper }>
      <div className={ styles.filtersCol }>
        <div className={ styles.filtersHeader }>Тип устройства</div>
        <div className={ styles.selectTypeWrapper }>
          <SelectMultiple options={ options }/>
        </div>
      </div>

    </div>
    <table className={ styles.tcd_table }>
      <thead className={ styles.tcd_thead }>
      <tr className={ styles.tcd_tr }>
        <td></td>
        <td className={ styles.tcd_td }>Название схемы</td>
        <td className={ styles.tcd_td }>Тип схемы</td>
        <td className={ styles.tcd_td }>Этапов</td>
      </tr>
      </thead>
      <tbody className={ styles.tcd_tbody }>
      { schemasTree.map((item, id) => {
        if (item.schema_type !== 'Testing') return (
          <>
            <tr className={ styles.tcd_tr }>
              <td>
                <img className={ `${ styles.arrowButton } 
                                  ${ item.innerSchemas.length === 0 && styles.blockedButton }
                                  ${ item.showInner === true && styles.activeButton }` }
                     src={ arrowButton } alt='list folding button'
                     onClick={ () => {
                       item.showInner === undefined ? item.showInner = true : item.showInner = !item.showInner
                       updateTree(item, id)
                     } }
                />
              </td>
              <td onClick={ () => history.push(`/production-schemas/schema/${ item.schema_id }`) }
                  className={ `${ styles.tcd_td } ${ styles.table_item_header }` }>{ item.unit_name }</td>
              <td className={ styles.tcd_td }>{ item.schema_type }</td>
              <td className={ styles.tcd_td }>{ item.production_stages?.length }</td>
            </tr>
            { item.showInner !== undefined && item.showInner && (item.innerSchemas.map((item, index) => {
              return (
                <tr className={ styles.tcd_tr } key={index + item.schema_id}>
                  <td className={ styles.tcd_td }>{ index + 1 }.</td>
                  <td onClick={ () => history.push(`/production-schemas/schema/${ item.schema_id }`) }
                      className={ `${ styles.tcd_td } ${ styles.table_item_header }` }>{ item.unit_name }</td>
                  <td className={ styles.tcd_td }>{ item.schema_type }</td>
                  <td className={ styles.tcd_td }>{ item.production_stages?.length }</td>
                </tr>
              )
            })) }
          </>
        )
      }) }
      </tbody>
    </table>
  </div>);
}
