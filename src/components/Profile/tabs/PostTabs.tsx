import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {Grid} from '@material-ui/core';

import {EmptyProfilePost} from '../EmptyProfilePost';
import {PrivateProfile} from '../PrivateProfile';

import {PostsListContainer} from 'components/PostList';
import {TimelineFilterContainer} from 'components/TimelineFilter';
import ShowIf from 'components/common/show-if.component';
import {FriendStatus} from 'src/interfaces/friend';
import {PrivacySettings} from 'src/interfaces/setting';
import {TimelineFilterFields} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';

type ProfilePostsTabProps = {
  anonymous?: boolean;
  user?: User;
  filters?: TimelineFilterFields;
  filterType?: 'origin' | 'type';
  sortType?: 'metric' | 'created';
};

export const ProfilePostsTab: React.FC<ProfilePostsTabProps> = props => {
  const {filters, filterType, user} = props;

  const {detail: profile, friendStatus} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );
  const privacy = useSelector<RootState, PrivacySettings>(
    state => state.configState.settings.privacy,
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

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <TimelineFilterContainer filters={filters} selectionType="sort" filterType={filterType} />
      </Grid>

      <ShowIf condition={totalPost === 0}>
        <EmptyProfilePost owner={isProfileOwner} />;
      </ShowIf>

      <ShowIf condition={totalPost > 0}>
        <PostsListContainer filters={filters} user={user} />
      </ShowIf>
    </>
  );
};
