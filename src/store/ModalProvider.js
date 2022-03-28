import { useState } from "react";
import ModalActionsContext from "./modal-context";

function ModalProvider(props) {
  const [isModalBarActive, setModalBarIsVisible] = useState(false);
  const [isModalConfirmActive, setModalConfirmIsVisible] = useState(false);
  

  const closeModal = () => {
    setModalBarIsVisible(false);
    setModalConfirmIsVisible(false);
  };

  const openModalBarHandler = () => {
    setModalBarIsVisible(true);
  };

  const openModalConfirmHandler = () => {
    setModalConfirmIsVisible(true);
  };

  const modalActions = {
    onClose: closeModal,

    onOpenBar: openModalBarHandler,
    onOpenConfirm: openModalConfirmHandler,
    modalBarStatus: isModalBarActive,
    modalConfirmStatus: isModalConfirmActive,
  };
  return (
    <ModalActionsContext.Provider value={modalActions}>
      {props.children}
    </ModalActionsContext.Provider>
  );
}

export default ModalProvider;
