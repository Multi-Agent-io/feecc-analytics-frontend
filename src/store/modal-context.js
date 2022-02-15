import React from "react";

const ModalActionsContext = React.createContext({
  onClose: () => {},
  onOpen: () => {},
});

export default ModalActionsContext;
