import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button/Button";

import Modal from "../../components/Modal/Modal"
import ModalActionsContext from "../../store/modal-context"
import RevisionContext from "../../store/revision-context";



function ConfirmModal () {

  const { modalConfirmStatus, onCloseConfirm } = useContext(ModalActionsContext);
  const { revisionsItem } = useContext(RevisionContext)
  const [nameRevision, setNameRevision] = useState([])
  const [idsRevision, setIdsRevision] = useState([])

  const pushToServerHandler = () => {

  }

  useEffect(()=> {
    
    setNameRevision(
      revisionsItem.map((item)=> {
        if(item){
          const name =  Object.values(item)[0];
          return name ? name : "Имени нет"
        }
      })
    )
    setIdsRevision(
      revisionsItem.map((item)=> {
        if(item){
          const name =  Object.keys(item)[0];
          return name ? name : "Имени нет"
        }
      })
    )
 
  },[revisionsItem])
  
  return (
    <>
      {modalConfirmStatus && (
        <Modal>
          <ul>
          {nameRevision.map( item => <li>{item}</li>)}
          {idsRevision.map( item => <li>{item}</li>)}
          </ul>
          <Button onClick ={pushToServerHandler}>Отправить на проверку</Button>
          <Button onClick ={onCloseConfirm}>Отмена</Button>
        </Modal>
      )}
    </>
  )
}

export default ConfirmModal