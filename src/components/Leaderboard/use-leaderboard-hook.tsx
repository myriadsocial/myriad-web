import {useState} from 'react';

import {User} from 'src/interfaces/user';
import {ListMeta} from 'src/lib/api/interfaces/base-list.interface';
import * as LeaderboardAPI from 'src/lib/api/leaderboard';

export const useLeaderboard = () => {
  const limit = 1000;
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [_meta, setMeta] = useState<ListMeta>({
    totalItemCount: 0,
    totalPageCount: 0,
    itemsPerPage: 10,
    currentPage: 0,
  });

  const fetchLeaderboard = async (page = 1) => {
    if (_meta.currentPage === 0) setLoading(true);

    try {
      const {data, meta} = await LeaderboardAPI.fetchLeaderboard(page);

      setMeta(meta);

      setLeaderboard([...leaderboard, ...data]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    leaderboard,
    fetchLeaderboard,
    loading,
    meta: _meta,
    limit,
  };
};
