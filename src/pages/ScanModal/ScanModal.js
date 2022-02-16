import { useContext, useEffect, useState } from "react"; 

import ModalActionsContext from "../../store/modal-context";
import { history } from "../../store/main";

import Modal from "../../components/Modal/Modal";

import barcodeLogo from "../../assets/barcode_scanner.png"

import classes from "./ScanModal.module.css"


function ScanModal () {
  const { modalBarStatus } = useContext(ModalActionsContext);

  let protocolId = ''; // because i don't now how to do this with useState

  const keyDownHandler = (event) => {

    if(event.key === "Enter"){
      window.location = `/tcd/protocol/${protocolId}`
    } else {
      if(!Number.isNaN(+event.key)){
        protocolId = protocolId + event.key
      }  
    }
  }

  useEffect(()=> {

    if(modalBarStatus){
      document.addEventListener("keydown", keyDownHandler);
    } else {
      document.removeEventListener("keydown", keyDownHandler)
      protocolId = '';
    } 
    
  }, [modalBarStatus])

  return (
    <>
      {modalBarStatus && (
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