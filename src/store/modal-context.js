import React from "react";

const ModalActionsContext = React.createContext({
  onClose: () => {},
  onOpenBar: () => {},
  onOpenConfirm: () => {},
});

export default ModalActionsContext;
