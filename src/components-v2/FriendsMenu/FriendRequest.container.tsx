import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {FriendRequestComponent} from './FriendRequest';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {FriendRequestState} from 'src/reducers/friend-request/reducer';

type FriendRequestContainerProps = {
  user?: User;
  disableFilter?: boolean;
};

export const FriendRequestListContainer: React.FC<FriendRequestContainerProps> = props => {
  const {user} = props;

  const {loadRequests, toggleRequest, removeFriendRequest} = useFriendsHook(user);
  const {openToasterSnack} = useToasterSnackHook();

  const {requests} = useSelector<RootState, FriendRequestState>(state => state.friendRequestState);

  useEffect(() => {
    loadRequests();
  }, [user]);

  const acceptFriendRequest = (request: Friend) => {
    toggleRequest(request, FriendStatus.APPROVED);

    openToasterSnack({
      message: 'Friend request accepted',
      variant: 'success',
    });
  };

  const declineFriendRequest = (request: Friend) => {
    removeFriendRequest(request);

    openToasterSnack({
      message: 'Friend request rejected',
      variant: 'warning',
    });
  };

  return (
    <FriendRequestComponent
      user={user}
      requests={requests}
      onAcceptRequest={acceptFriendRequest}
      onDeclineRequest={declineFriendRequest}
    />
  );
};
