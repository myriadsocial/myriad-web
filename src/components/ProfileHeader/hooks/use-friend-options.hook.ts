import {FriendStatus} from 'src/interfaces/friend';
import {FriendStatusProps, User} from 'src/interfaces/user';

type FriendOptions = {
  self: boolean;
  isFriend: boolean;
  isRequested: boolean;
  isRequesting: boolean;
  isBlocked: boolean;
  canAddFriend: boolean;
};

export const useFriendOptions = (
  person: User & FriendStatusProps,
  currentUser?: User,
): FriendOptions => {
  const self = (): boolean => person?.status === FriendStatus.OWNED;
  const isFriend = (): boolean => person?.status === FriendStatus.APPROVED;
  const isRequested = (): boolean => {
    return person?.status === FriendStatus.PENDING && person?.requestee === currentUser?.id;
  };

  const isRequesting = (): boolean => {
    return person?.status === FriendStatus.PENDING && person?.requester === currentUser?.id;
  };

  return {
    self: self(),
    isFriend: isFriend(),
    isRequested: isRequested(),
    isRequesting: isRequesting(),
    canAddFriend: !self() && !Boolean(person?.status),
    isBlocked: person?.status === FriendStatus.BLOCKED,
  };
};
