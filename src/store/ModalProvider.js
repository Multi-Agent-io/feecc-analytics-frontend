import { useState } from "react";
import ModalActionsContext from "./modal-context";

function ModalProvider(props) {
  const [isModalActive, setModalIsVisibale] = useState(false);

  const closeModalHandler = () => {
    setModalIsVisibale(false);
  };
  const openModalHandler = () => {
    setModalIsVisibale(true);
  };

  const modalActions = {
    onOpen: openModalHandler,
    onClose: closeModalHandler,
    modalStatus: isModalActive,
  };
  return (
    <ModalActionsContext.Provider value={modalActions}>
      {props.children}
    </ModalActionsContext.Provider>
  );
}

export default ModalProvider;
