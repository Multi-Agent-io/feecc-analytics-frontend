import Modal from "../../components/Modal/Modal";
import { useContext } from "react"; 
import ModalActionsContext from "../../store/modal-context";

import barcodeLogo from "../../assets/barcode_scanner.png"

import classes from "./ScanModal.module.css"

function ScanModal () {
  const { onClose, modalStatus } = useContext(ModalActionsContext);
  

  return (
    <>
      {modalStatus && (
        <Modal>
          <section className={classes.modal}>
            <img alt="Отсканируйте штрих код" src = {barcodeLogo}/>
            <h2>Отсканируйте штрих код...</h2>
          </section>
          

        </Modal>
      )}
    </>
  )

}

export default ScanModal