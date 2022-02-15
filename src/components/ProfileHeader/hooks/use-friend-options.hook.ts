import {Friend, FriendStatus} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';

type FriendOptions = {
  self: boolean;
  isFriend: boolean;
  isRequested: boolean;
  isRequesting: boolean;
  isBlocked: boolean;
  canAddFriend: boolean;
};

export const useFriendOptions = (
  person: User,
  currentUser?: User,
  friend?: Friend,
): FriendOptions => {
  const self = (): boolean => {
    return currentUser?.id === person.id;
  };

  const isFriended = (): boolean => {
    return Boolean(friend);
  };

  const isFriend = (): boolean => {
    return Boolean(friend) && friend?.status === FriendStatus.APPROVED;
  };

  const isRequested = (): boolean => {
    return friend?.status === FriendStatus.PENDING && friend?.requesteeId === currentUser?.id;
  };

  const isRequesting = (): boolean => {
    return friend?.status === FriendStatus.PENDING && friend?.requestorId === currentUser?.id;
  };

  return {
    self: self(),
    isFriend: isFriend(),
    isRequested: isRequested(),
    isRequesting: isRequesting(),
    canAddFriend: !self() && !isFriended(),
    isBlocked: isFriended() && friend?.status === FriendStatus.BLOCKED,
  };
};
