import React from 'react';

const ModalActionsContext = React.createContext({
  onClose: () => {},
  onOpenBar: () => {},
  onOpenConfirm: () => {},
  onDeleteProtocol: () => {},
});

export default ModalActionsContext;
