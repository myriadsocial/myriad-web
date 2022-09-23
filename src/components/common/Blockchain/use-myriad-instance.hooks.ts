import {useContext} from 'react';

import MyriadInstanceContext, {HandleMyriadInstance} from './MyriadInstance.context';

const useMyriadInstance = (): HandleMyriadInstance => {
  const myriadInstance = useContext(MyriadInstanceContext);

  if (!myriadInstance) {
    throw new Error('myriadInstance must be use within a MyriadInstanceProvider');
  }

  return myriadInstance;
};

export default useMyriadInstance;
