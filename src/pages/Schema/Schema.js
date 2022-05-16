import React, { useEffect, useState } from "react";
import styles from "./Schema.module.css";
import { history } from "../../store/main";
import { useDispatch, useSelector } from "react-redux";
import { getSchema, getSchemas } from "../../store/selectors";
import {
  Button,
  ButtonBack,
  Tag,
  TransitionModal,
  Input,
} from "../../components";
import { doGetSchemas, doUpdateSchema } from "../../store/userActions";
import Loading from "../../components/Loading/Loading";
import { useSnackbar } from "notistack";

// import rightArrow from "../../assets/right_purple_arrow.svg";

function Schema(props) {
  const schema_id = history.location.pathname.split("/")[3];
  const schema = useSelector((state) => getSchema(state, schema_id));
  const [stages, setStages] = useState([]);
  const [modify, setModify] = useState([]); // [boolean, boolean, ...]
  const [open, setOpen] = useState([]); // [boolean, boolean, ...]
  const [remove, setRemoved] = useState([]); // [{status: boolean, timeLeft: int}, {...}]
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const addNotification = (message, variant) =>
    enqueueSnackbar(message, { variant });

  // Checking if schema is not found in local storage and requests it if needed from the server
  useEffect(() => {
    if (schema === undefined || schema === null) {
      doGetSchemas(dispatch).then((res) => {
        setLoading(false);
      });
    } else setLoading(false);
  }, []);

  // Textarea auto-height logic and stages storage
  useEffect(() => {
    // console.log("Fresh schema", schema);
    // Storing production stages in stages array
    setStages(schema?.production_stages);

    // To perform action after component is fully displayed
    setTimeout(() => {
      const tx = document.getElementsByTagName("textarea");
      for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute(
          "style",
          "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
        );
        tx[i].addEventListener("input", onTextareaInput, false);
      }
    });

    return () => {
      const tx = document.getElementsByTagName("textarea");
      for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute(
          "style",
          "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
        );
        tx[i].removeEventListener("input", onTextareaInput, false);
      }
    };
  }, [schema]);

  function onTextareaInput() {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  }

  // Filling array with no modify flags
  useEffect(() => {
    let temp1 = [...modify];
    let temp2 = [...open];
    let temp3 = [...remove];
    stages &&
      stages.forEach((item, index) => {
        if (temp1[index] === undefined) temp1[index] = false;
        if (temp2[index] === undefined) temp2[index] = false;
        if (temp3[index] === undefined) {
          console.log("item undefined");
          temp3[index] = { status: false, timeLeft: 0 };
        }
      });
    setModify(temp1);
    setOpen(temp2);
    setRemoved(temp3);
  }, [stages]);

  /**
   * Функция возвращает окончание для множественного числа слова на основании правил русского языка и
   * переданного ей количества элементов.
   * @param length - the length of the array
   */
  let getLetter = (length) => {
    let letter = "";
    if (length === 0 || length > 4) letter = "ов";
    else if (length > 1 && length < 5) letter = "а";
    else letter = "";
    return letter;
  };

  const changeModifyModalStatus = (index) => {
    setModify(
      modify.map((item, innerIndex) => (index === innerIndex ? !item : item))
    );
  };

  const changeRemoveModalStatus = (index) => {
    console.log("changing remove modal status");
    setOpen(
      open.map((item, innerIndex) => (index === innerIndex ? !item : item))
    );
  };

  const removeStepFromSchema = (index) => {
    let tempSchema = {
      ...schema,
      production_stages: stages.filter(
        (item, innerIndex) => index !== innerIndex
      ),
    };
    console.log("temp schema", tempSchema);
    changeRemoveModalStatus(index);
    addNotification(`Вы удалили этап '${stages[index].name}'`, "success");

    setRemoved(
      remove.map((item, innerIndex) => {
        if (index === innerIndex) {
          console.log("removing step", item);
          console.log("step index", index);
          let timer = setInterval(() => {
            // if (remove[innerIndex].timeLeft <= 1000)
            console.log('tick ', remove[innerIndex].timeLeft)
          }, 1000)
          

          item = { 
            ...item, 
            status: !item.status, 
            timeLeft: 10, 
            timerId: timer
          };
          
        }
        return item
      })
    );

    setTimeout(() => console.log("removed", remove));
    // TODO send request to server to update schema object
    // TODO update schema from the server
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
                  {schema?.production_stages?.length} этап
                  {getLetter(schema?.production_stages?.length)}
                </Tag>
                {schema?.required_components_schema_ids && (
                  <Tag>
                    {schema?.required_components_schema_ids?.length} элемент
                    {getLetter(
                      schema?.required_components_schema_ids?.length
                    )}{" "}
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
                    {schema?.innerSchemas.map((item) => {
                      return (
                        <div
                          onClick={() =>
                            history.push(
                              `/production-schemas/schema/${item?.schema_id}`
                            )
                          }
                        >
                          <Tag hover shadow>
                            {item?.unit_name}
                          </Tag>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <div>
              <h2>Schema contents</h2>
              <div className={styles.schemaContents}>
                {stages?.map((item, index) => {
                  return (
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
                      <TransitionModal
                        open={modify[index]}
                        handleClose={() => changeModifyModalStatus(index)}
                      >
                        <h2>Изменить этап</h2>
                        <div className={styles.modifyModalContent}>
                          <div className={styles.stepHeader}>Тип:</div>
                          <div className={styles.stepContent}>{item.type}</div>
                          <div className={styles.stepContentUpdate}>
                            <Input />
                          </div>

                          <div className={styles.stepHeader}>Место:</div>
                          <div className={styles.stepContent}>
                            {item.workplace}
                          </div>
                          <div className={styles.stepContentUpdate}>
                            <Input />
                          </div>

                          <div className={styles.stepHeader}>Имя:</div>
                          <div className={styles.stepContent}>{item.name}</div>
                          <div className={styles.stepContentUpdate}>
                            <Input value={name} onChange={setName} />
                          </div>

                          <div className={styles.stepHeader}>Описание:</div>
                          <div className={styles.stepContent}>
                            {item.description}
                          </div>
                          <div className={styles.stepContentUpdate}>
                            <Input
                              value={description}
                              onChange={setDescription}
                            />
                          </div>
                        </div>
                        <div className={styles.removeModalControls}>
                          <Button
                            onClick={() => {
                              console.log(item);
                              console.log("Name:", name);
                              console.log("Description:", description);
                            }}
                          >
                            Сохранить
                          </Button>
                          <Button
                            warning
                            onClick={() => changeModifyModalStatus(index)}
                          >
                            Отменить
                          </Button>
                        </div>
                      </TransitionModal>

                      {/* Modal for requesting additional approve from user to remove step */}
                      <TransitionModal
                        open={open[index]}
                        handleClose={() => changeRemoveModalStatus(index)}
                      >
                        <h2>
                          Вы собираетесь удалить этап {index + 1} из сборки. Это
                          действие необратимо!
                        </h2>
                        <div className={styles.removeModalContent}>
                          <div className={styles.stepHeader}>
                            Имя удаляемого этапа:
                          </div>
                          <div className={styles.stepContent}>{item.name}</div>
                          <div className={styles.stepHeader}>
                            Описание удаляемого этапа:
                          </div>
                          <div className={styles.stepContent}>
                            {item.description}
                          </div>
                        </div>

                        <div className={styles.removeModalControls}>
                          <Button
                            warning
                            onClick={() => removeStepFromSchema(index)}
                          >
                            Удалить
                          </Button>
                          <Button
                            onClick={() => changeRemoveModalStatus(index)}
                          >
                            Отменить
                          </Button>
                        </div>
                        {/* <div>You are going to remove step {index+1}!</div> */}
                      </TransitionModal>
                      {remove[index]?.status === true && (
                        <div className={styles.cardPlaceholder}>
                          <div>Этап будет удалён через</div>
                          <div className={styles.countdownWrapper}>
                            {remove[index]?.timeLeft} секунд
                          </div>
                          <div className={styles.controlsWrapper}>
                            <Button>Восстановить</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Schema;
