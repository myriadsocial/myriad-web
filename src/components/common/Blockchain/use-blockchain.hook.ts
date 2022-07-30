import {useContext} from 'react';

import BlockchainContext, {HandleBlockchain} from './Blockchain.context';

const useBlockchain = (): HandleBlockchain => {
  const blockchain = useContext(BlockchainContext);

  if (!blockchain) {
    throw new Error('useBlockchain must be use within a BlockchainProvider');
  }

  return blockchain;
};

export default useBlockchain;
