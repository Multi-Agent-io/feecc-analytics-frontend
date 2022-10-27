/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import classes from './Modal.module.css';
import ModalActionsContext from '../../store/modal-context';

function Backdrop() {
  const { onClose } = useContext(ModalActionsContext);

  return <div onClick={onClose} className={classes.backdrop} />;
}

function ModalOverlay({ children }) {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{children}</div>
    </div>
  );
}

function Modal({ children }) {
  const portalPlace = document.querySelector('#overlays');

  return (
    <>
      {ReactDOM.createPortal(<Backdrop />, portalPlace)}
      {ReactDOM.createPortal(
        <ModalOverlay>{children}</ModalOverlay>,
        portalPlace,
      )}
    </>
  );
}

export default Modal;

ModalOverlay.propTypes = {
  children: PropTypes.element.isRequired,
};

Modal.propTypes = {
  children: PropTypes.element.isRequired,
};
