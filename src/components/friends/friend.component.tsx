import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import DividerComponent from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import {useFriendsHook} from '../../hooks/use-friends-hook';
import FriendListComponent from './friend-list.component';
import FriendRequestComponent from './friend-requests.component';

import {debounce} from 'lodash';
import SearchComponent from 'src/components/common/search.component';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

interface FriendComponentProps {
  title?: string;
}

const FriendComponent: React.FC<FriendComponentProps> = props => {
  const {title} = props;

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const [search, setSearchQuery] = useState('');

  const {searchFriend, loadFriends, loadRequests, toggleRequest} = useFriendsHook();

  useEffect(() => {
    loadFriends();
    loadRequests();
  }, []);

  const handleSearchFriend = debounce((query: string) => {
    setSearchQuery(query);

    if (query.length) {
      searchFriend(query);
    } else {
      loadFriends();
    }
  }, 300);

  if (!user && !anonymous) return null;

  return (
    <div style={{padding: 8}}>
      <div style={{paddingTop: 16, paddingBottom: 8}}>
        <Typography variant="h4" style={{marginBottom: 16}}>
          {' '}
          {title || 'Your Friends'}
        </Typography>

        <SearchComponent
          value={search}
          placeholder="Find a Friend"
          onSubmit={handleSearchFriend}
          isDebounce
        />
      </div>

      <FriendRequestComponent toggleRequest={toggleRequest} />
      <DividerComponent />
      <FriendListComponent />
    </div>
  );
};

export default FriendComponent;
