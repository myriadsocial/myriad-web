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
  const self = (): boolean => person?.friendInfo?.status === 'owner';

  return {
    self: self(),
    isFriend: person?.friendInfo?.status === 'friends',
    isRequested: person?.friendInfo?.status === 'respond',
    isRequesting: person?.friendInfo?.status === 'requested',
    canAddFriend: !self() && !Boolean(person?.friendInfo?.status),
    isBlocked: person?.friendInfo?.status === FriendStatus.BLOCKED,
  };
};
