import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {FriendRequestComponent} from './FriendRequest';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {debounce} from 'lodash';
import {useFriendsHook} from 'src/hooks/use-friends-hook';
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
  const enqueueSnackbar = useEnqueueSnackbar();

  const {requests} = useSelector<RootState, FriendRequestState>(state => state.friendRequestState);

  useEffect(() => {
    loadRequests();
  }, [user]);

  const acceptFriendRequest = debounce((request: Friend) => {
    toggleRequest(request, FriendStatus.APPROVED);

    enqueueSnackbar({
      message: 'Friend request accepted',
      variant: 'success',
    });
  }, 300);

  const declineFriendRequest = debounce((request: Friend) => {
    removeFriendRequest(request);

    enqueueSnackbar({
      message: 'Friend request rejected',
      variant: 'warning',
    });
  }, 300);

  return (
    <FriendRequestComponent
      user={user}
      requests={requests}
      onAcceptRequest={acceptFriendRequest}
      onDeclineRequest={declineFriendRequest}
    />
  );
};

export default FriendRequestListContainer;
