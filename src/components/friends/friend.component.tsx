import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import DividerComponent from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import {useFriendsHook} from '../../hooks/use-friends-hook';
import FriendListComponent from './friend-list.component';
import FriendRequestComponent from './friend-requests.component';
import {useStyles} from './friend.style';

import {debounce} from 'lodash';
import SearchComponent from 'src/components/common/search.component';
import {useToggle} from 'src/hooks/use-toggle.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

interface FriendComponentProps {
  title?: string;
}

const FriendComponent: React.FC<FriendComponentProps> = ({title}) => {
  const style = useStyles();

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const [expandFriends, toggleExpandFriends] = useToggle(true);
  const [search, setSearchQuery] = useState('');

  const {searchFriend, loadFriends, loadMoreFriends, loadRequests, toggleRequest} =
    useFriendsHook();

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

  const showAllFriendRequest = () => {
    toggleExpandFriends();
  };

  const handleMinimizeFriendRequest = () => {
    toggleExpandFriends();
  };

  if (!user && !anonymous) return null;

  return (
    <div className={style.root}>
      <div className={style.header}>
        <Typography variant="h4" className={style.title}>
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

      <FriendRequestComponent
        toggleRequest={toggleRequest}
        onShowAll={showAllFriendRequest}
        onMinimize={handleMinimizeFriendRequest}
      />
      <DividerComponent />
      <FriendListComponent showMore={loadMoreFriends} expand={expandFriends} />
    </div>
  );
};

export default FriendComponent;
