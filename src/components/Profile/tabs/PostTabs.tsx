import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {Grid} from '@material-ui/core';

import {EmptyProfilePost} from '../EmptyProfilePost';
import {PrivateProfile} from '../PrivateProfile';

import {PostsListContainer} from 'components/PostList';
import {TimelineFilterContainer} from 'components/TimelineFilter';
import {FriendStatus} from 'src/interfaces/friend';
import {UserSettings} from 'src/interfaces/setting';
import {TimelineFilterFields} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';

type ProfilePostsTabProps = {
  anonymous?: boolean;
  filters?: TimelineFilterFields;
  filterType?: 'origin' | 'type';
  sortType?: 'metric' | 'created';
};

export const ProfilePostsTab: React.FC<ProfilePostsTabProps> = props => {
  const {filters, filterType} = props;

  const {detail: profile, friendStatus} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );
  const {privacy} = useSelector<RootState, UserSettings>(
    state => state.configState.settings,
    shallowEqual,
  );
  const user = useSelector<RootState, User | undefined>(
    state => state.userState.user,
    shallowEqual,
  );
  const totalPost = useSelector<RootState, number>(
    state => state.timelineState.meta.totalItemCount,
    shallowEqual,
  );

  const isFriend = friendStatus?.status === FriendStatus.APPROVED;
  const isProfileOwner = profile?.id == user?.id;
  const isPrivateProfile = privacy.accountPrivacy == 'private';

  if (isPrivateProfile && !isFriend && !isProfileOwner) {
    return <PrivateProfile />;
  }

  if (totalPost === 0) {
    return <EmptyProfilePost owner={isProfileOwner} />;
  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <TimelineFilterContainer filters={filters} selectionType="sort" filterType={filterType} />
      </Grid>

      <PostsListContainer filters={filters} />
    </>
  );
};
