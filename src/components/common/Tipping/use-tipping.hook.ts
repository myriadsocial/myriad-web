import {useContext} from 'react';

import SendTipContext, {HandleTipping} from './Tipping.context';

const useTipping = (): HandleTipping => {
  const tipping = useContext(SendTipContext);

  if (!tipping) {
    throw new Error('useTipping must be used within a TippingProvider');
  }

  return tipping;
};

export default useTipping;
