import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';

export type FriendRequestDetail = {
  id: string;
  name: string;
  avatar?: string;
  totalMutual?: number;
  friend: Friend;
};

export const useFriendRequestList = (friends: Friend[], user?: User): FriendRequestDetail[] => {
  if (!user) return [];

  return friends.reduce(function (list: FriendRequestDetail[], friend) {
    if (friend.requestorId === user.id && friend.requestee) {
      list.push({
        id: friend.requesteeId,
        avatar: friend.requestee.profilePictureURL,
        name: friend.requestee.name,
        totalMutual: friend.totalMutual,
        friend,
      });
    }

    if (friend.requesteeId === user.id && friend.requestor) {
      list.push({
        id: friend.requestorId,
        avatar: friend.requestor.profilePictureURL,
        name: friend.requestor.name,
        totalMutual: friend.totalMutual,
        friend,
      });
    }

    return list;
  }, []);
};

export const useBlockList = (blockList: Friend[], user?: User): FriendRequestDetail[] => {
  if (!user) return [];

  return blockList.reduce(function (list: FriendRequestDetail[], friend) {
    if (friend.requestorId === user.id && friend.requestee) {
      list.push({
        id: friend.requesteeId,
        avatar: friend.requestee.profilePictureURL,
        name: friend.requestee.name,
        friend,
      });
    }

    return list;
  }, []);
};
