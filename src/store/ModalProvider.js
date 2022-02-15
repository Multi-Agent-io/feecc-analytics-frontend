import { useState } from "react";
import ModalActionsContext from "./modal-context";

function ModalProvider(props) {
  const [isModalBarActive, setModalBarIsVisibale] = useState(false);
  const [isModalConfirmActive, setModalConfirmIsVisibale] = useState(false);
  

  const closeModalBarHandler = () => {
    setModalBarIsVisibale(false);
  };
  const openModalBarHandler = () => {
    setModalBarIsVisibale(true);
  };

  
  const closeModalConfirmHandler = () => {
    setModalConfirmIsVisibale(false);
  };
  const openModalConfirmHandler = () => {
    setModalConfirmIsVisibale(true);
  };

  const modalActions = {
    onCloseBar: closeModalBarHandler,
    onOpenBar: openModalBarHandler,
    onCloseConfirm: closeModalConfirmHandler,
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
