import { useContext } from "react";

import Modal from "../../components/Modal/Modal"
import ModalActionsContext from "../../store/modal-context"
import classes from "./ConfirmModal.module.css"



function ConfirmModal () {

  const { modalConfirmStatus } = useContext(ModalActionsContext);

  return (
    <>
      {modalConfirmStatus && (
        <Modal>
          <div>Are u sure?</div>
        </Modal>
      )}
    </>
  )
}

export default ConfirmModal