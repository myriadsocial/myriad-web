import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {shallowEqual, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {ExperienceList} from './ExperienceList';
import {ExperienceListRightBar} from './ExperienceListRightBar';
import {useExperienceList} from './hooks/use-experience-list.hook';

import useConfirm from 'components/common/Confirm/use-confirm.hook';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Skeleton} from 'src/components/Expericence';
import {LoadMoreComponent} from 'src/components/atoms/LoadMore/LoadMore';
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
  buttonLoad?: boolean;
  loadNextPage?: () => void;
  refreshExperience?: () => void;
  noButton?: boolean;
};

export const useStyles = makeStyles<Theme, ExperienceListContainerProps>(theme =>
  createStyles({
    root: {
      overflowX: props => (props.selectable ? 'auto' : 'unset'),
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
    buttonLoad,
    loadNextPage,
    refreshExperience,
    noButton,
  } = props;

  const style = useStyles(props);
  const router = useRouter();
  const enqueueSnackbar = useEnqueueSnackbar();
  const confirm = useConfirm();
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
  const totalOwnedExperience = userExperiencesMeta.additionalData?.totalOwnedExperience ?? 0;

  const handleViewPostList = (type: TimelineType, userExperience: WrappedExperience) => {
    if (filterTimeline) {
      router.push(`/?type=experience&id=${userExperience.experience.id}`, undefined, {
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

    if (totalOwnedExperience >= 5 || !user.fullAccess || user.fullAccess !== undefined) {
      confirm({
        title: i18n.t('LiteVersion.LimitTitleExperiance'),
        description: i18n.t('LiteVersion.LimitDescExperiance'),
        icon: 'warning',
        confirmationText: i18n.t('LiteVersion.ConnectWallet'),
        cancellationText: i18n.t('LiteVersion.MaybeLater'),
        onConfirm: () => {
          router.push({pathname: '/wallet', query: {type: 'manage'}});
        },
        onCancel: () => {
          undefined;
        },
      });
    } else {
      if (totalOwnedExperience >= 10) {
        enqueueSnackbar({
          message: i18n.t('Experience.List.Alert'),
          variant: 'warning',
        });
      } else {
        router.push(`/experience/${experienceId}/clone`);
      }
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
    <div className={style.root} id="scrollable-list-experiences">
      <InfiniteScroll
        scrollableTarget="scrollable-list-experiences"
        dataLength={experiences.length}
        hasMore={hasMore}
        next={handleLoadNextPage}
        // TODO: fixed load more with scroll
        loader={buttonLoad ? <LoadMoreComponent loadmore={handleLoadNextPage} /> : <Skeleton />}>
        {noButton ? (
          <ExperienceListRightBar
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
        ) : (
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
        )}
      </InfiniteScroll>
    </div>
  );
};
