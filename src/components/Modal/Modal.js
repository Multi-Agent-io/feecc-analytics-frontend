import classes from "./Modal.module.css";
import ReactDOM from "react-dom";
import { useContext, useEffect } from "react/cjs/react.development";
import ModalActionsContext from "../../store/modal-context";

function Backdrop(props) {

  const { onCloseBar, onCloseConfirm } = useContext(ModalActionsContext);
  return <div onClick={() => {onCloseBar();onCloseConfirm()}} className={classes.backdrop}></div>;
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

  const keyDownHandler = (event) => {
    console.log(event.key);
  }
  
  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler)
    } 
  },[])
  
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
