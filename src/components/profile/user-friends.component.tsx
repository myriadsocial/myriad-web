import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';

import { debounce } from 'lodash';
import SearchComponent from 'src/components/common/search.component';
import FriendList from 'src/components/profile/friend-list.component';
import { useProfile } from 'src/components/profile/profile.context';
import { useFriendHook } from 'src/components/profile/use-friend.hook';
import { useUser } from 'src/context/user.context';
import { ExtendedUserPost } from 'src/interfaces/user';

interface UserFriendProps {
  profile: ExtendedUserPost;
}

const UserFriendComponent: React.FC<UserFriendProps> = props => {
  const { searchFriend } = useFriendHook(props.profile);
  const {
    state: { user }
  } = useUser();
  const {
    state: { totalFriends }
  } = useProfile();
  const [search, setSearchQuery] = useState('');

  const handleSearchFriend = debounce((query: string) => {
    console.log('SEARCH', query), setSearchQuery(query);
    searchFriend(query);
  }, 300);

  if (!user) return null;

  return (
    <div style={{ padding: 8, background: 'white', borderRadius: 8 }}>
      <div style={{ paddingTop: 16, paddingBottom: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          Friends with {totalFriends} people
        </Typography>

        <SearchComponent value={search} placeholder="Find a Friend" onSubmit={handleSearchFriend} />
      </div>

      <FriendList profile={props.profile} />
    </div>
  );
};

export default UserFriendComponent;
