import {useContext} from 'react';

import ConfirmContext, {HandleConfirm} from './Confirm.context';

const useConfirm = (): HandleConfirm => {
  const confirm = useContext(ConfirmContext);

  if (!confirm) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return confirm;
};

export default useConfirm;
