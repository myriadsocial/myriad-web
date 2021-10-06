import {Friend} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';

type FriendDetail = {
  id: string;
  name: string;
  avatar?: string;
};

export const useFriendList = (friends: Friend[], user?: User): FriendDetail[] => {
  if (!user) return [];

  return friends.reduce(function (list: FriendDetail[], friend) {
    if (friend.requestorId === user.id && friend.requestee) {
      list.push({
        id: friend.requesteeId,
        avatar: friend.requestee.profilePictureURL,
        name: friend.requestee.name,
      });
    }

    if (friend.requesteeId === user.id && friend.requestor) {
      list.push({
        id: friend.requestorId,
        avatar: friend.requestor.profilePictureURL,
        name: friend.requestor.name,
      });
    }

    return list;
  }, []);
};
