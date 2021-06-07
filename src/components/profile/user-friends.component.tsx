import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';

import FriendListComponent from '../friends/friend-list.component';
import { useFriendsHook } from '../friends/use-friends-hook';

import { debounce } from 'lodash';
import SearchComponent from 'src/components/common/search.component';
import { useFriends } from 'src/components/friends/friends.context';
import { useUser } from 'src/components/user/user.context';

interface UserFriendProps {}

const UserFriendComponent: React.FC<UserFriendProps> = props => {
  const {
    state: { user }
  } = useUser();
  const {
    state: { friends }
  } = useFriends();
  const [search, setSearchQuery] = useState('');

  if (!user) return null;
  //@ts-ignore
  const { searchFriend } = useFriendsHook(user);

  const handleSearchFriend = debounce((query: string) => {
    console.log('SEARCH', query), setSearchQuery(query);
    searchFriend(query);
  }, 300);

  return (
    <div style={{ padding: 8, background: 'white', borderRadius: 8 }}>
      <div style={{ paddingTop: 16, paddingBottom: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          Friends with {friends.length} people
        </Typography>

        <SearchComponent value={search} placeholder="Find a Friend" onSubmit={handleSearchFriend} />
      </div>

      <FriendListComponent user={user} />
    </div>
  );
};

export default UserFriendComponent;
