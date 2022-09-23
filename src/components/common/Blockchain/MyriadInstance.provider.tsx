import React, {useEffect, useState} from 'react';

import MyriadInstanceContext from './MyriadInstance.context';
import {useIsMountedRef} from './use-mounted-ref.hooks';

import {IProvider, MyriadProvider} from 'src/lib/services/myriad-provider';

type BlockchainProviderProps = {
  children: React.ReactNode;
};

const MyriadInstanceProvider: React.ComponentType<BlockchainProviderProps> = ({children}) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (!isMountedRef.current) return;
    connect();
  }, [isMountedRef]);

  const connect = async () => {
    try {
      const myriad = await MyriadProvider.connect();
      setProvider(myriad);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyriadInstanceContext.Provider value={{provider, loading, error}}>
      {children}
    </MyriadInstanceContext.Provider>
  );
};

export default MyriadInstanceProvider;
