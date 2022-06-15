/* eslint-disable react/jsx-filename-extension */
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ModalActionsContext from './modal-context';

function ModalProvider({ children }) {
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

  const modalActions = useMemo(() => ({
    onClose: closeModal,

    onOpenBar: openModalBarHandler,
    onOpenConfirm: openModalConfirmHandler,
    onDeleteProtocol: openModalProtocolDeleteHandler,
    modalBarStatus: isModalBarActive,
    modalConfirmStatus: isModalConfirmActive,
    modalDeleteStatus: isModalProtocolDeleteActive,
  }));

  return (
    <ModalActionsContext.Provider value={modalActions}>
      {children}
    </ModalActionsContext.Provider>
  );
}

export default ModalProvider;

ModalProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
