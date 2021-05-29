import React, { useState } from 'react';

import DividerComponent from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import FriendListComponent from './friend-list.component';
import FriendRequestComponent from './friend-requests.component';

import SearchComponent from 'src/components/common/search.component';
import { useUser } from 'src/components/user/user.context';

interface TopicProps {
  title?: string;
}

const FriendComponent: React.FC<TopicProps> = props => {
  const { title } = props;

  const { state } = useUser();
  const [search, setSearchQuery] = useState('');

  if (!state.user) return null;

  const handleSearchFriend = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div style={{ padding: 8 }}>
      <div style={{ paddingTop: 16, paddingBottom: 8 }}>
        <Typography variant="h4" style={{ marginBottom: 16 }}>
          {' '}
          {title || 'Your Friends'}
        </Typography>

        <SearchComponent value={search} placeholder="Find a Friend" onSubmit={handleSearchFriend} />
      </div>

      <FriendRequestComponent user={state.user} />
      <DividerComponent />
      <FriendListComponent user={state.user} />
    </div>
  );
};

export default FriendComponent;
