import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useTranslation } from 'react-i18next';
import { doGetSchemas } from '../../store/userActions';
import { Search, SelectMultiple } from '../../components';
import styles from './Schemas.module.css';
import { getSchemas } from '../../store/selectors';

import arrowButton from '../../assets/next.png';

export default function Schemas() {
  const dispatch = useDispatch();
  const schemas = useSelector((state) => getSchemas(state));
  const [schemasTree, setSchemasTree] = useState([]);

  const options = [
    { state: false, name: 'Type 1' },
    { state: false, name: 'Type 2' },
    {
      state: false,
      name: 'Type 3',
    },
    { state: false, name: 'Type 4' },
  ];

  useEffect(() => {
    doGetSchemas(dispatch).then(() => {
    });
  }, []);

  useEffect(() => {
    const tree = schemas.filter((schema) => schema.parent_schema_id === null);

    const newTree = tree.map((schema) => ({
      ...schema,
      innerSchema: schemas.filter((item) => item.parent_schema_id === schema.schema_id),
    }));
    // console.log('New schemas tree', tree);
    setSchemasTree(newTree);
  }, [schemas]);

  const updateTree = (newItem, id) => {
    const arr = schemasTree;
    arr.map((item, index) => {
      if (index === id) return newItem;
      return item;
    });
    setSchemasTree([...arr]);
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.searchWrapper}>
        <Search placeholder="Enter schema name" />
      </div>
      <div className={styles.filtersWrapper}>
        <div className={styles.filtersCol}>
          <div className={styles.filtersHeader}>Тип устройства</div>
          <div className={styles.selectTypeWrapper}>
            <SelectMultiple options={options} />
          </div>
        </div>
      </div>
      <table className={styles.tcd_table}>
        <thead className={styles.tcd_thead}>
          <tr className={styles.tcd_tr}>
            <td />
            <td className={styles.tcd_td}>Название схемы</td>
            <td className={styles.tcd_td}>Тип схемы</td>
            <td className={styles.tcd_td}>Этапов</td>
          </tr>
        </thead>
        <tbody className={styles.tcd_tbody}>
          {schemasTree.filter((item) => item.schema_type !== 'Testing')
            .map((item, id) => (
              <>
                <tr className={styles.tcd_tr}>
                  <td>
                    <button
                      type="button"
                      onClick={() => {
                        const tempItem = item;
                        if (tempItem.innerSchemas.length > 0) {
                          if (tempItem.showInner === undefined) {
                            tempItem.showInner = true;
                          } else {
                            tempItem.showInner = !tempItem.showInner;
                          }
                          updateTree(tempItem, id);
                        }
                      }}
                    >
                      <img
                        className={`${styles.arrowButton} ${item.innerSchemas.length === 0 && styles.blockedButton} ${item.showInner === true && styles.activeButton}`}
                        src={arrowButton}
                        alt="list folding button"
                      />
                    </button>

                  </td>
                  <td className={`${styles.tcd_td} ${styles.table_item_header}`}>
                    <a href={`/production-schemas/schema/${item.schema_id}`}>
                      {item.unit_name}
                    </a>
                  </td>
                  <td className={styles.tcd_td}>{item.schema_type}</td>
                  <td className={styles.tcd_td}>
                    {item.production_stages?.length}
                  </td>
                </tr>
                {item.showInner !== undefined
                  && item.showInner
                  && item.innerSchemas.map((innerSchemaItem, index) => (
                    <tr
                      className={styles.tcd_tr}
                      key={innerSchemaItem.schema_id}
                    >
                      <td className={styles.tcd_td}>
                        {index + 1}
                        .
                      </td>
                      <td className={`${styles.tcd_td} ${styles.table_innerSchemaItem_header}`}>
                        <a href={`/production-schemas/schema/${innerSchemaItem.schema_id}`}>{innerSchemaItem.unit_name}</a>
                      </td>
                      <td className={styles.tcd_td}>{innerSchemaItem.schema_type}</td>
                      <td className={styles.tcd_td}>
                        {innerSchemaItem.production_stages?.length}
                      </td>
                    </tr>
                  ))}
              </>
            ))}
        </tbody>
      </table>
    </div>
  );
}
