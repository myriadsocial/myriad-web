import {useState, useCallback} from 'react';

import useMyriadInstance from 'components/common/Blockchain/use-myriad-instance.hooks';
import {ServerListProps} from 'src/interfaces/server-list';

export const useInstances = () => {
  const {provider} = useMyriadInstance();

  const [serverList, setServerList] = useState<ServerListProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllInstances = useCallback(async () => {
    try {
      if (!provider) return;

      const result = await provider.serverList();

      const servers = await Promise.all(
        result.map(async server => {
          let data = null;
          let apiURL = server.apiUrl;

          if (apiURL[apiURL.length - 1] === '/') {
            apiURL = apiURL.substring(0, apiURL.length - 1);
          }

          try {
            const response = await fetch(`${server.apiUrl}/server`);
            data = await response.json();
          } catch {
            // ignore
          }

          return {
            ...server,
            apiUrl: apiURL,
            detail: data,
          };
        }),
      );

      setServerList(servers);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [provider]);

  return {
    getAllInstances,
    servers: serverList,
    loading,
  };
};
