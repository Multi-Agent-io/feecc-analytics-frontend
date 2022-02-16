import { useState } from "react";
import ModalActionsContext from "./modal-context";

function ModalProvider(props) {
  const [isModalBarActive, setModalBarIsVisibale] = useState(false);
  const [isModalConfirmActive, setModalConfirmIsVisibale] = useState(false);
  

  const closeModal = () => {
    setModalBarIsVisibale(false);
    setModalConfirmIsVisibale(false);
  };

  const openModalBarHandler = () => {
    setModalBarIsVisibale(true);
  };

  const openModalConfirmHandler = () => {
    setModalConfirmIsVisibale(true);
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
