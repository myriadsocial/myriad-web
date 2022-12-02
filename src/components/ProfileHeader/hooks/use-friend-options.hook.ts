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

export const useFriendOptions = (person: User & {friendInfo: FriendStatusProps}): FriendOptions => {
  const self = (): boolean => person?.friendInfo.status === 'owner';
  const isFriend = (): boolean => person?.friendInfo.status === 'friends';
  const isRequested = (): boolean => {
    return person?.friendInfo.status === 'respond';
  };

  const isRequesting = (): boolean => {
    return person?.friendInfo.status === 'requested';
  };

  return {
    self: self(),
    isFriend: isFriend(),
    isRequested: isRequested(),
    isRequesting: isRequesting(),
    canAddFriend: !self() && !Boolean(person?.friendInfo.status),
    isBlocked: person?.friendInfo.status === FriendStatus.BLOCKED,
  };
};
