import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {FriendRequestComponent} from './FriendRequest';

import {useFriendsHook} from 'src/hooks/use-friends-hook';
import {useToasterHook} from 'src/hooks/use-toaster.hook';
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {Status} from 'src/interfaces/toaster';
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
  const {openToaster} = useToasterHook();

  const {requests} = useSelector<RootState, FriendRequestState>(state => state.friendRequestState);

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleSearchFriendRequest = (query: string) => {
    // code
  };

  const acceptFriendRequest = (request: Friend) => {
    toggleRequest(request, FriendStatus.APPROVED);

    openToaster({
      message: 'Friend request accepted',
      toasterStatus: Status.SUCCESS,
    });
  };

  const declineFriendRequest = (request: Friend) => {
    removeFriendRequest(request);

    openToaster({
      message: 'Friend request rejected',
      toasterStatus: Status.WARNING,
    });
  };

  console.log('requests', requests);
  return (
    <FriendRequestComponent
      user={user}
      requests={requests}
      onAcceptRequest={acceptFriendRequest}
      onDeclineRequest={declineFriendRequest}
      onSearch={handleSearchFriendRequest}
    />
  );
};
