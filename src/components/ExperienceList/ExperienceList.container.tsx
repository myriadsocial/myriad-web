import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {shallowEqual, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {ExperienceList} from './ExperienceList';
import {useExperienceList} from './hooks/use-experience-list.hook';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Skeleton} from 'src/components/Expericence';
import {ExperienceOwner, useExperienceHook} from 'src/hooks/use-experience-hook';
import {WrappedExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';

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

export const useStyles = makeStyles<Theme, ExperienceListContainerProps>(theme =>
  createStyles({
    root: {
      maxHeight: '512px',
      overflowX: props => (props.selectable ? 'scroll' : 'unset'),
      whiteSpace: 'nowrap',
    },
  }),
);

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

  const style = useStyles(props);
  const router = useRouter();
  const enqueueSnackbar = useEnqueueSnackbar();

  const user = useSelector<RootState, User | undefined>(
    state => state.userState.user,
    shallowEqual,
  );
  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );

  const {
    loadExperience,
    removeExperience,
    unsubscribeExperience,
    subscribeExperience,
    userExperiencesMeta,
  } = useExperienceHook();
  const {list: experiences} = useExperienceList(owner);

  const handleViewPostList = (type: TimelineType, userExperience: WrappedExperience) => {
    if (filterTimeline) {
      router.push(`/home?type=experience&id=${userExperience.experience.id}`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/topic/experience?id=${userExperience.experience.id}`);
    }
  };

  const handleRemoveExperience = (experienceId: string) => {
    removeExperience(experienceId, () => {
      loadExperience();
    });
  };

  const handleCloneExperience = (experienceId: string) => {
    if (!enableClone) return;

    const totalOwnedExperience = userExperiencesMeta.additionalData?.totalOwnedExperience ?? 0;
    if (totalOwnedExperience >= 10) {
      enqueueSnackbar({
        message: i18n.t('Experience.List.Alert'),
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handleSubscribeExperience = (experienceId: string) => {
    if (!enableSubscribe) return;

    subscribeExperience(experienceId, () => {
      refreshExperience && refreshExperience();
    });
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
    <div className={style.root}>
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
          anonymous={anonymous}
          {...props}
        />
      </InfiniteScroll>
    </div>
  );
};
