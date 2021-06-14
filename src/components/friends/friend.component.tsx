import React, { useState } from 'react';

import DividerComponent from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { useFriendsHook } from '../../hooks/use-friends-hook';
import FriendListComponent from './friend-list.component';
import FriendRequestComponent from './friend-requests.component';

import { debounce } from 'lodash';
import SearchComponent from 'src/components/common/search.component';
import { useUser } from 'src/context/user.context';

interface TopicProps {
  title?: string;
}

const FriendComponent: React.FC<TopicProps> = props => {
  const { title } = props;

  const {
    state: { user, anonymous }
  } = useUser();
  const [search, setSearchQuery] = useState('');

  const { searchFriend } = useFriendsHook(user);

  const handleSearchFriend = debounce((query: string) => {
    setSearchQuery(query);
    searchFriend(query);
  }, 300);

  if (!user && !anonymous) return null;

  return (
    <div style={{ padding: 8 }}>
      <div style={{ paddingTop: 16, paddingBottom: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          {' '}
          {title || 'Your Friends'}
        </Typography>

        <SearchComponent value={search} placeholder="Find a Friend" onSubmit={handleSearchFriend} />
      </div>

      <FriendRequestComponent user={user} />
      <DividerComponent />
      <FriendListComponent user={user} />
    </div>
  );
};

export default FriendComponent;
