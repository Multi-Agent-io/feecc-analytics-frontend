import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

const useNotify = () => {
  const { enqueueSnackbar } = useSnackbar();

  const addNotification = useCallback((message, variant) => enqueueSnackbar(message, { variant }));
  return addNotification;
};

export default useNotify;
