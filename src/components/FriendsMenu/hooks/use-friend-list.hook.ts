import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';

export type FriendDetail = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  totalMutual?: number;
};

export const useFriendList = (friends: Friend[], user?: User): FriendDetail[] => {
  if (!user) return [];

  return friends.reduce(function (list: FriendDetail[], friend) {
    if (friend.requestorId === user.id && friend.requestee) {
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
};
