import React, { useEffect, useState } from 'react';
import styles from './Schema.module.css'
import { history } from "../../store/main";
import { useDispatch, useSelector } from "react-redux";
import { getSchema, getSchemaFromTree } from "../../store/selectors";
import { ButtonBack, Tag } from '../../components'
import { doGetSchemas } from "../../store/userActions";
import Loading from "../../components/Loading/Loading";

function Schema(props) {

  const schema_id = history.location.pathname.split('/')[3]
  let schema = useSelector(state => getSchema(state, schema_id))

  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  const [isLocked, setLock] = useState(false)

  useEffect(() => {
    if (schema === undefined || schema === null) {
      doGetSchemas(dispatch).then((res) => {
        setLoading(false)
      })
    }
    else
      setLoading(false)
  }, [])

  // Textarea auto-height logic
  useEffect(() => {
    // To perform action after component is fully displayed
    setTimeout(() => {
      const tx = document.getElementsByTagName("textarea");
      for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
        tx[i].addEventListener("input", onTextareaInput, false);
      }
    })

    return () => {
      const tx = document.getElementsByTagName("textarea");
      for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
        tx[i].removeEventListener("input", onTextareaInput, false);
      }
    }
  }, [schema])
  function onTextareaInput() {
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
  }

  let getLetter = (length) => {
    let letter = '';
    if (length === 0 || length > 4)
      letter = 'ов'
    else if (length > 1 && length < 5)
      letter = 'а'
    else
      letter = ''
    return letter
  }

  let updateTextareaName = (e, index) => {
    if(!isLocked) {
      schema.production_stages.map((item, innerIndex) => {
        if (index === innerIndex)
          item.name = e.target.value
        return item
      })
    }
  }

  return (<>
      { loading && (<Loading/>) }

      { !loading && (
        <div className={ styles.contentWrapper }>
          <div className={ styles.schemaHeader }>
            <ButtonBack/>
            <div>
              <div className={ styles.schemaName }>{ schema?.unit_name }</div>
              <div className={ styles.schemaShortInfo }>
                {/* SCHEMA TAGS */ }
                <Tag>{ schema?.schema_type }</Tag>
                <Tag>{ schema?.schema_id }</Tag>
                <Tag>{ schema?.production_stages.length } этап{ getLetter(schema?.production_stages.length) }</Tag>
                { schema?.required_components_schema_ids && (
                  <Tag>{ schema?.required_components_schema_ids.length } элемент
                    { getLetter(schema?.required_components_schema_ids.length) } для начала сборки
                  </Tag>) }
              </div>
            </div>
          </div>
          <div className={ styles.schemaMainInfo }>
            <div>
              { schema?.innerSchemas && (
                <>
                  <div className={styles.innerSchemasName}>Inner schemas</div>
                  <div className={styles.innerSchemas}>
                    { schema?.innerSchemas.map((item) => {
                      return (
                        <div onClick={ () => history.push(`/production-schemas/schema/${ item?.schema_id }`) }>
                          <Tag hover>{ item?.unit_name }</Tag>
                        </div>
                      )
                    })}
                  </div>

                </>
              ) }
            </div>
            <div>
              <h2>Schema contents</h2>
              <ol>
              {schema?.production_stages?.map((item, index) => {
                return (
                    <li>
                      <div>
                        <textarea value={item.name} onChange={(e) => updateTextareaName(e, index)}/>
                        <textarea value={item.description}/>
                      </div>
                    </li>
                )
              })}
              </ol>

            </div>
          </div>
        </div>
      ) }
    </>
  );
}

export default Schema;