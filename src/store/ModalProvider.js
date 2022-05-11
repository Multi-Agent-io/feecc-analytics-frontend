import { useState } from "react";
import ModalActionsContext from "./modal-context";

function ModalProvider(props) {
  const [isModalBarActive, setModalBarIsVisible] = useState(false);
  const [isModalConfirmActive, setModalConfirmIsVisible] = useState(false);
  const [isModalProtocolDeleteActive, setModalProtocolDeleteVisible] = useState(false);

  const closeModal = () => {
    setModalBarIsVisible(false);
    setModalConfirmIsVisible(false);
    setModalProtocolDeleteVisible(false);
  };

  const openModalBarHandler = () => {
    setModalBarIsVisible(true);
  };

  const openModalConfirmHandler = () => {
    setModalConfirmIsVisible(true);
  };

  const openModalProtocolDeleteHandler = () => {
    setModalProtocolDeleteVisible(true);
  };

  const modalActions = {
    onClose: closeModal,

    onOpenBar: openModalBarHandler,
    onOpenConfirm: openModalConfirmHandler,
    onDeleteProtocol: openModalProtocolDeleteHandler,
    modalBarStatus: isModalBarActive,
    modalConfirmStatus: isModalConfirmActive,
    modalDeleteStatus: isModalProtocolDeleteActive,
  };
  return (
    <ModalActionsContext.Provider value={modalActions}>
      {props.children}
    </ModalActionsContext.Provider>
  );
}

export default ModalProvider;
