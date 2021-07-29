import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import Typography from '@material-ui/core/Typography';

import {useFriendHook} from '../use-profile-friend.hook';
import FriendList from './friend-list.component';

import {debounce} from 'lodash';
import SearchComponent from 'src/components/common/search.component';
import {ExtendedUser} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

interface UserFriendProps {
  profile: ExtendedUser;
}

const UserFriendComponent: React.FC<UserFriendProps> = ({profile}) => {
  const {searchFriend, cancelFriendRequest} = useFriendHook();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {friends, totalFriends} = useSelector<RootState, ProfileState>(state => state.profileState);
  const [search, setSearchQuery] = useState('');

  const handleSearchFriend = debounce((query: string) => {
    setSearchQuery(query);
    searchFriend(profile, query);
  }, 300);

  if (!user) return null;

  return (
    <div style={{padding: 8, background: 'white', borderRadius: 8}}>
      <div style={{paddingTop: 16, paddingBottom: 8}}>
        <Typography variant="h4" style={{marginBottom: 16}}>
          Friends with {totalFriends} people
        </Typography>

        <SearchComponent
          value={search}
          placeholder="Find a Friend"
          onSubmit={handleSearchFriend}
          isDebounce
        />
      </div>

      <FriendList profile={profile} friends={friends} cancelFriendRequest={cancelFriendRequest} />
    </div>
  );
};

export default UserFriendComponent;
