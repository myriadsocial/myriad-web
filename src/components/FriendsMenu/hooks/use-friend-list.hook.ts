import {useEffect, useState} from 'react';

import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';

export type UserWithMutual = User & {
  totalMutual?: number;
};

type FriendListHook = {
  friendList: UserWithMutual[];
  removeFromFriendList: (userId: string) => void;
};

export const useFriendList = (friends: Friend[], user?: UserWithMutual): FriendListHook => {
  const [friendList, setFriendList] = useState<UserWithMutual[]>([]);

  useEffect(() => {
    if (!user) return;

    const list = friends.reduce(function (list: UserWithMutual[], friend) {
      if (friend.requestorId === user.id && friend.requestee && !friend?.requestee?.deletedAt) {
        list.push({
          ...friend.requestee,
          totalMutual: friend.totalMutual ?? 0,
        });
      }
      return list;
    }, []);

    setFriendList(list);
  }, [friends, user]);

  const removeFromFriendList = (userId: string) => {
    const newFriendList = friendList.filter(friend => friend.id !== userId);

    setFriendList(newFriendList);
  };

  return {
    friendList,
    removeFromFriendList,
  };
};
