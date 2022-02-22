import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ExperienceList} from './ExperienceList';

import {Skeleton} from 'src/components/Expericence';
import {ExperienceOwner, useExperienceHook} from 'src/hooks/use-experience-hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Experience, WrappedExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type ExperienceListContainerProps = {
  owner?: ExperienceOwner;
  selectable: boolean;
  enableClone?: boolean;
  enableSubscribe?: boolean;
  hasMore?: boolean;
  loadNextPage?: () => void;
  refreshExperience?: () => void;
};

export const ExperienceListContainer: React.FC<ExperienceListContainerProps> = props => {
  const {
    owner = ExperienceOwner.ALL,
    enableClone,
    enableSubscribe,
    hasMore = false,
    loadNextPage,
    refreshExperience,
  } = props;

  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const router = useRouter();

  const {
    experiences,
    userExperiences,
    profileExperiences,
    loadExperience,
    removeExperience,
    unsubscribeExperience,
    subscribeExperience,
  } = useExperienceHook();
  const {openToasterSnack} = useToasterSnackHook();

  const subscribedExperiencesIds = userExperiences.map(item => item.experience.id);
  const usedExperiences: WrappedExperience[] =
    owner === ExperienceOwner.ALL
      ? experiences.map(experience => ({
          id: userExperiences.find(item => item.experience.id === experience.id)?.id ?? undefined,
          subscribed: subscribedExperiencesIds.includes(experience.id),
          experience,
        }))
      : owner === ExperienceOwner.CURRENT_USER
      ? userExperiences
      : profileExperiences;

  const handleViewPostList = (type: TimelineType, experience: Experience) => {
    //TODO: don't check route, change to params
    if (['/home'].includes(router.route)) {
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

    if (userExperiences.length >= 10) {
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

    if (userExperiences.length >= 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      subscribeExperience(experienceId);
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
        experiences={usedExperiences}
        user={user}
        {...props}
      />
    </InfiniteScroll>
  );
};
