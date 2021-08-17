import {useSelector, shallowEqual} from 'react-redux';

import {RootState} from 'src/reducers';
import {FriendState} from 'src/reducers/friend/reducer';
import {UserState} from 'src/reducers/user/reducer';

type FriendDetail = {
  id: string;
  name: string;
  avatar?: string;
};

export const useFriendList = (): FriendDetail[] => {
  const {user} = useSelector<RootState, UserState>(state => state.userState, shallowEqual);
  const {friends} = useSelector<RootState, FriendState>(state => state.friendState, shallowEqual);

  if (!user) return [];

  return friends.map(friend => {
    if (friend.requestorId === user.id) {
      return {
        id: friend.requesteeId,
        avatar: friend.requestee.profilePictureURL,
        name: friend.requestee.name,
      };
    } else {
      return {
        id: friend.requestorId,
        avatar: friend.requestor.profilePictureURL,
        name: friend.requestor.name,
      };
    }
  });
};
