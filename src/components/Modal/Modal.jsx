import classes from "./Modal.module.css";
import ReactDOM from "react-dom";

import { useContext} from "react";
import ModalActionsContext  from "../../store/modal-context";

function Backdrop(props) {

  const { onClose } = useContext(ModalActionsContext);

  return <div onClick={onClose} className={classes.backdrop}></div>;
}

function ModalOverlay(props) {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
}

function Modal(props) {

  const portalPlace = document.querySelector("#overlays");

  return (
    <>
      {ReactDOM.createPortal(<Backdrop />, portalPlace)}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        portalPlace
      )}
    </>
  );
}

export default Modal;
