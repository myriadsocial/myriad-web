import {useState} from 'react';

import {User} from 'src/interfaces/user';
import * as LeaderboardAPI from 'src/lib/api/leaderboard';

export const useLeaderboard = () => {
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);

  const fetchLeaderboard = async () => {
    setLoading(true);

    try {
      const {data} = await LeaderboardAPI.fetchLeaderboard();

      setLeaderboard(data);
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
  };
};
