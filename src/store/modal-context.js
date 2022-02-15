import React from "react";

const ModalActionsContext = React.createContext({
  onCloseBar: () => {},
  onOpenBar: () => {},
  onCloseConfirm: () => {},
  onOpenConfirm: () => {},
});

export default ModalActionsContext;
