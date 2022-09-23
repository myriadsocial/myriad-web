import {useState} from 'react';

import {ServerListProps} from 'src/interfaces/server-list';

export const useInstances = () => {
  const [serverList, setServerList] = useState<ServerListProps[]>([]);
  const [metric, setMetric] = useState({totalUsers: 0, totalPosts: 0, totalInstances: 0});
  const [loading, setLoading] = useState<boolean>(true);

  const getAllInstances = async provider => {
    let totalUsers = 0;
    let totalPosts = 0;

    try {
      if (!provider) return;

      const [result, totalInstances] = await Promise.all([
        provider.serverList(),
        provider.totalServer(),
      ]);
      const servers = await Promise.all(
        result.map(async server => {
          let data = null;

          try {
            const response = await fetch(`${server.apiUrl}/server`);
            data = await response.json();
          } catch {
            // ignore
          }

          totalUsers += data?.metric?.totalUsers ?? 0;
          totalPosts += data?.metric?.totalPosts ?? 0;

          return {
            ...server,
            detail: data,
          };
        }),
      );

      setMetric({
        totalUsers,
        totalPosts,
        totalInstances,
      });
      setServerList(servers);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  return {
    getAllInstances,
    servers: serverList,
    metric,
    loading,
  };
};
