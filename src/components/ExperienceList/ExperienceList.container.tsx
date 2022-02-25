import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ExperienceList} from './ExperienceList';
import {useExperienceList} from './hooks/use-experience-list.hook';

import {Skeleton} from 'src/components/Expericence';
import {ExperienceOwner, useExperienceHook} from 'src/hooks/use-experience-hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Experience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type ExperienceListContainerProps = {
  owner?: ExperienceOwner;
  selectable: boolean;
  enableClone?: boolean;
  enableSubscribe?: boolean;
  hasMore?: boolean;
  filterTimeline?: boolean;
  loadNextPage?: () => void;
  refreshExperience?: () => void;
};

export const ExperienceListContainer: React.FC<ExperienceListContainerProps> = props => {
  const {
    owner = ExperienceOwner.ALL,
    enableClone,
    enableSubscribe,
    hasMore = false,
    filterTimeline = false,
    loadNextPage,
    refreshExperience,
  } = props;

  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const router = useRouter();

  const {loadExperience, removeExperience, unsubscribeExperience, subscribeExperience} =
    useExperienceHook();
  const {list: experiences, limitExceeded} = useExperienceList(owner);
  const {openToasterSnack} = useToasterSnackHook();

  const handleViewPostList = (type: TimelineType, experience: Experience) => {
    if (filterTimeline) {
      router.push(`/home?type=experience&id=${experience.id}`);
    } else {
      router.push(`/topic/experience?id=${experience.id}`);
    }
  };

  const handleRemoveExperience = (experienceId: string) => {
    removeExperience(experienceId, () => {
      loadExperience();
    });
  };

  const handleCloneExperience = (experienceId: string) => {
    if (!enableClone) return;

    if (limitExceeded) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handleSubscribeExperience = (experienceId: string) => {
    if (!enableSubscribe) return;

    if (limitExceeded) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      subscribeExperience(experienceId, () => {
        refreshExperience && refreshExperience();
      });
    }
  };

  const handleUnsubscribeExperience = (userExperienceId: string) => {
    unsubscribeExperience(userExperienceId, () => {
      refreshExperience && refreshExperience();
    });
  };

  const handleLoadNextPage = () => {
    loadNextPage && loadNextPage();
  };

  return (
    <InfiniteScroll
      scrollableTarget="scrollable-searched-experiences"
      dataLength={experiences.length}
      hasMore={hasMore}
      next={handleLoadNextPage}
      loader={<Skeleton />}>
      <ExperienceList
        onDelete={handleRemoveExperience}
        onUnsubscribe={handleUnsubscribeExperience}
        onSubscribe={handleSubscribeExperience}
        onClone={handleCloneExperience}
        viewPostList={handleViewPostList}
        experiences={experiences}
        user={user}
        {...props}
      />
    </InfiniteScroll>
  );
};
