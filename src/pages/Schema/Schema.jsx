/* eslint-disable react/no-this-in-sfc */
import React, { useEffect, useState } from 'react';

import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

import { history } from '../../store/main';
import { getSchema } from '../../store/selectors';
import {
  Button,
  ButtonBack,
  Tag,
  ModifyStepModal,
  RemoveStepModal,
} from '../../components';
import { doGetSchemas } from '../../store/userActions';
import Loading from '../../components/Loading/Loading';

import styles from './Schema.module.css';

function Schema() {
  const schemaId = history.location.pathname.split('/')[3];
  const schema = useSelector((state) => getSchema(state, schemaId));
  const [stages, setStages] = useState([]);
  const [modifyModalFlags, setModifyModals] = useState([]); // [boolean, boolean, ...]
  const [removeModalFlags, setOpenModals] = useState([]); // [boolean, boolean, ...]
  const [removedCards, setRemovedCards] = useState([]); // [{status: boolean, timeLeft: int}, {...}]
  const [removedTimers, setRemovedTimers] = useState([]); // [timer, timer, timer, ...]

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const addNotification = (message, variant) => enqueueSnackbar(message, { variant });
  // Checking if schema is not found in local storage and requests it if needed from the server
  useEffect(() => {
    if (schema === undefined || schema === null) {
      doGetSchemas(dispatch).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  function onTextareaInput() {
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
  }

  // Textarea auto-height logic and stages storage
  useEffect(() => {
    // Storing production stages in stages array
    setStages(schema?.production_stages);

    // To perform action after component is fully displayed
    setTimeout(() => {
      const tx = document.getElementsByTagName('textarea');
      for (let i = 0; i < tx.length; i += 1) {
        tx[i].setAttribute(
          'style',
          // eslint-disable-next-line prefer-template
          'height:' + tx[i].scrollHeight + 'px;overflow-y:hidden;',
        );
        tx[i].addEventListener('input', onTextareaInput, false);
      }
    });

    return () => {
      const tx = document.getElementsByTagName('textarea');
      for (let i = 0; i < tx.length; i += 1) {
        tx[i].setAttribute(
          'style',
          `height:${tx[i].scrollHeight}px;overflow-y:hidden;`,
        );
        tx[i].removeEventListener('input', onTextareaInput, false);
      }
    };
  }, [schema]);

  // Filling array with no modify flags
  useEffect(() => {
    const temp1 = [...modifyModalFlags];
    const temp2 = [...removeModalFlags];
    const temp3 = [...removedCards];
    const temp4 = [...removedTimers];
    if (stages) {
      stages.forEach((item, index) => {
        if (temp1[index] === undefined) temp1[index] = false;
        if (temp2[index] === undefined) temp2[index] = false;
        if (temp3[index] === undefined) {
          // console.log('item undefined');
          temp3[index] = {
            status: false,
            timeLeft: 10,
          };
        }
        if (temp4[index] === undefined) {
          temp4[index] = null;
        }
      });
    }
    setModifyModals(temp1);
    setOpenModals(temp2);
    setRemovedCards(temp3);
    setRemovedTimers(temp4);
  }, [stages]);

  useEffect(() => {
    removedCards.map((card, cardIndex) => {
      if (card.timeLeft === -1) {
        clearInterval(removedTimers[cardIndex]);
        addNotification(`Step ${cardIndex} was removed`, 'success');
        return {
          ...card,
          timeLeft: 10,
        };
      }
      return card;
    });
  }, [removedCards]);

  const getLetter = (length) => {
    let letter = '';
    if (length === 0 || length > 4) {
      letter = 'ов';
    } else if (length > 1 && length < 5) {
      letter = 'а';
    } else {
      letter = '';
    }
    return letter;
  };

  const changeModifyModalStatus = (index) => {
    setModifyModals(
      modifyModalFlags.map((item, innerIndex) => (index === innerIndex ? !item : item)),
    );
  };

  const changeRemoveModalStatus = (index) => {
    setOpenModals(
      removeModalFlags.map((item, innerIndex) => (index === innerIndex ? !item : item)),
    );
  };
  // TODO Change something for it to look better
  const removeStep = (index) => {
    const tempTimers = [...removedTimers];
    tempTimers[index] = setInterval(() => {
      const tempCards = [...removedCards];
      if (tempCards[index].timeLeft >= 0) {
        tempCards[index] = {
          ...tempCards[index],
          timeLeft: tempCards[index].timeLeft -= 1,
          status: true,
        };
      } else {
        tempCards[index] = {
          ...tempCards[index],
          status: false,
          timeLeft: -1,
        };
      }

      setRemovedCards(tempCards);
    }, 1000);

    setRemovedTimers(tempTimers);

    changeRemoveModalStatus(index);

    addNotification(`Вы удаляете этап '${stages[index].name}'`, 'warning');
  };

  return (
    <>
      {loading && <Loading />}

      {!loading && (
        <div className={styles.contentWrapper}>
          <div className={styles.schemaHeader}>
            <ButtonBack />
            <div>
              <div className={styles.schemaName}>{schema?.unit_name}</div>
              <div className={styles.schemaShortInfo}>
                {/* SCHEMA TAGS */}
                <Tag>{schema?.schema_type}</Tag>
                <Tag>{schema?.schema_id}</Tag>
                <Tag>
                  {schema?.production_stages?.length}
                  этап
                  {getLetter(schema?.production_stages?.length)}
                </Tag>
                {schema?.required_components_schema_ids && (
                  <Tag>
                    {schema?.required_components_schema_ids?.length}
                    элемент
                    {getLetter(
                      schema?.required_components_schema_ids?.length,
                    )}
                      {' '}
                    для начала сборки
                  </Tag>
                )}
              </div>
            </div>
          </div>
          <div className={styles.schemaMainInfo}>
            <div>
              {schema?.innerSchemas && (
                <>
                  <div className={styles.innerSchemasName}>Inner schemas</div>
                  <div className={styles.innerSchemas}>
                    {schema?.innerSchemas.map((item) => (
                      <div
                        role="button"
                        tabIndex="0"
                        onClick={() => history.push(`/production-schemas/schema/${item?.schema_id}`)}
                        onKeyDown={() => history.push(`/production-schemas/schema/${item?.schema_id}`)}
                      >
                        <Tag hover shadow>
                          {item?.unit_name}
                        </Tag>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div>
              <h2>Schema contents</h2>
              <div className={styles.schemaContents}>
                {stages?.map((item, index) => (
                  <div className={styles.stepCard}>
                    <div>
                      <textarea value={item.name} />
                      <textarea value={item.description} />
                    </div>
                    <div className={styles.controlsWrapper}>
                      <Button onClick={() => changeModifyModalStatus(index)}>
                        Изменить
                      </Button>
                      <Button
                        warning
                        onClick={() => changeRemoveModalStatus(index)}
                      >
                        Удалить
                      </Button>
                    </div>
                    <div className={styles.stepIndex}>{index + 1}</div>

                    {/* Modal for changing step content */}
                    <ModifyStepModal
                      open={modifyModalFlags[index]}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...item}
                      closeModal={() => changeModifyModalStatus(index)}
                    />

                    {/* Modal for requesting additional approve from user to remove step */}
                    <RemoveStepModal
                      open={removeModalFlags[index]}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...item}
                      closeModal={() => changeRemoveModalStatus(index)}
                      removeStep={() => removeStep(index)}
                      index={index}
                    />
                    {removedCards[index]?.status === true && (
                      <div className={styles.cardPlaceholder}>
                        <div>Этап будет удалён через</div>
                        <div className={styles.countdownWrapper}>
                          {removedCards[index]?.timeLeft}
                          секунд
                        </div>
                        <div className={styles.controlsWrapper}>
                          <Button>Восстановить</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Schema;
