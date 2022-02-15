import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {EmptyProfilePost} from '../EmptyProfilePost';
import {PrivateProfile} from '../PrivateProfile';

import {TimelineContainer} from 'src/components/Timeline';
import {useTimelineFilter} from 'src/components/Timeline/hooks/use-timeline-filter.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {FriendStatus} from 'src/interfaces/friend';
import {UserSettings} from 'src/interfaces/setting';
import {TimelineFilter} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';

type ProfilePostsTabProps = {
  anonymous?: boolean;
  filters?: TimelineFilter;
  filterType?: 'origin' | 'type';
  sortType?: 'metric' | 'created';
};

export const ProfilePostsTab: React.FC<ProfilePostsTabProps> = props => {
  const {filters} = props;

  const {filterTimeline} = useTimelineFilter(filters);
  const {query} = useQueryParams();

  const {detail: profile, friendStatus} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );
  const {privacy} = useSelector<RootState, UserSettings>(state => state.configState.settings);
  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const totalPost = useSelector<RootState, number>(
    state => state.timelineState.meta.totalItemCount,
  );

  const isFriend = friendStatus?.status === FriendStatus.APPROVED;
  const isProfileOwner = profile?.id == user?.id;
  const isPrivateProfile = privacy.accountPrivacy == 'private';

  useEffect(() => {
    filterTimeline(query);
  }, [query]);

  if (isPrivateProfile && !isFriend && !isProfileOwner) {
    return <PrivateProfile />;
  }

  if (isProfileOwner && totalPost === 0) {
    return <EmptyProfilePost owner={isProfileOwner} />;
  }

  return (
    <>
      <TimelineContainer {...props} fetchInitial={false} />
    </>
  );
};
