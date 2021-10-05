import React from 'react';

import {Toaster} from '.';
import {useToasterHook} from '../../../hooks/use-toaster.hook';

export const ToasterContainer: React.FC = () => {
  const {open, toasterStatus, message, clearToaster} = useToasterHook();

  if (!toasterStatus) return null;

  return (
    <Toaster toasterStatus={toasterStatus} message={message} open={open} onClose={clearToaster} />
  );
};
