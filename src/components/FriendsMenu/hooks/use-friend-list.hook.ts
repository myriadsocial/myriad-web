import {useEffect, useState} from 'react';

import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';

export type FriendDetail = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  totalMutual?: number;
};

type FriendListHook = {
  friendList: FriendDetail[];
  removeFromFriendList: (userId: string) => void;
};

export const useFriendList = (friends: Friend[], user?: User): FriendListHook => {
  const [friendList, setFriendList] = useState<FriendDetail[]>([]);

  useEffect(() => {
    if (!user) return;

    const list = friends.reduce(function (list: FriendDetail[], friend) {
      if (friend.requestorId === user.id && friend.requestee && !friend?.requestee?.deletedAt) {
        list.push({
          id: friend.requesteeId,
          avatar: friend.requestee.profilePictureURL,
          name: friend.requestee.name,
          username: friend.requestee.username ?? friend.requestee.name.toLowerCase(),
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
