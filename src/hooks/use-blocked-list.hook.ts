import {useState} from 'react';
import {useDispatch} from 'react-redux';

import {User} from 'src/interfaces/user';
import * as FriendAPI from 'src/lib/api/friends';
import {getBlockList} from 'src/reducers/block/actions';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBlockList = (user?: User) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  const load = () => {
    if (!user) return;

    dispatch(getBlockList(user));
  };

  const loadAll = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const {data} = await FriendAPI.getBlockList(user.id, 0);

      setBlockedUserIds(
        data.map(_data => {
          if (user.id !== _data.requesteeId) return _data.requesteeId;
          else return _data.requestorId;
        }),
      );
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    load,
    loadAll,
    blockedUserIds,
  };
};
