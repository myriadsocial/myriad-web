import { PlusIcon } from '@heroicons/react/outline';

import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import { Button, Grid } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './Tab.style';

import { Skeleton } from 'components/Expericence';
import ExperienceQuickRightBar from 'components/ExperienceQuick/ExperienceQuickRightBar';
import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { useFilterOption } from 'components/TimelineFilter/hooks/use-filter-option.hook';
import { DropdownMenu } from 'components/atoms/DropdownMenu';
import useConfirm from 'components/common/Confirm/use-confirm.hook';
import {
  ExperienceListContainer,
  EmptyExperience,
} from 'src/components/ExperienceList';
import ShowIf from 'src/components/common/show-if.component';
import {
  ExperienceOwner,
  useExperienceHook,
} from 'src/hooks/use-experience-hook';
import { TimelineFilterCreated } from 'src/interfaces/timeline';
import { User } from 'src/interfaces/user';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';
import { fetchUserExperience } from 'src/reducers/user/actions';

type ExperienceTabProps = {
  experienceType?: 'user' | 'trending';
  menuDrawer?: boolean;
  showQuick?: boolean;
  showFilter?: boolean;
};

export const ExperienceTab: React.FC<ExperienceTabProps> = props => {
  const {
    experienceType = 'user',
    menuDrawer = false,
    showQuick = false,
    showFilter = true,
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<TimelineFilterCreated>();
  const [createTimeline, setCreateTimeline] = useState<boolean>(false);
  const confirm = useConfirm();
  const { createdFilter } = useFilterOption();

  const router = useRouter();
  const dispatch = useDispatch();
  const styles = useStyles();
  const {
    userExperiences,
    userExperiencesMeta,
    loadNextUserExperience,
    clearUserExperience,
  } = useExperienceHook();

  const user = useSelector<RootState, User | undefined>(
    state => state.userState.user,
    shallowEqual,
  );

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const handleCreateExperience = () => {
    if (!user) {
      confirm({
        icon: 'createTimeline',
        title: i18n.t('Confirm.Anonymous.CreateTimeline.Title'),
        description: i18n.t('Confirm.Anonymous.CreateTimeline.Desc'),
        confirmationText: i18n.t('General.SignIn'),
        cancellationText: i18n.t('LiteVersion.MaybeLater'),
        onConfirm: () => {
          router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
        },
      });
    } else {
      const fullAccess = user?.fullAccess ?? false;
      const totalOwnedExperience =
        userExperiencesMeta.additionalData?.totalOwnedExperience ?? 0;

      if (!fullAccess) {
        if (totalOwnedExperience >= 5) {
          return confirm({
            title: i18n.t('LiteVersion.LimitTitleExperience'),
            description: i18n.t('LiteVersion.LimitDescExperience'),
            icon: 'warning',
            confirmationText: i18n.t('LiteVersion.ConnectWallet'),
            cancellationText: i18n.t('LiteVersion.MaybeLater'),
            onConfirm: () => {
              router.push({ pathname: '/wallet', query: { type: 'manage' } });
            },
            onCancel: () => {
              undefined;
            },
          });
        }
      }

      handleShowCreateTimeline();
    }
  };

  const handleLoadNextPage = () => {
    loadNextUserExperience(type);
  };

  const handleFilter = async (filter: TimelineFilterCreated) => {
    await clearUserExperience();
    setType(filter);
    setLoading(true);
    const type = filter === TimelineFilterCreated.ME ? 'personal' : 'other';
    await dispatch(fetchUserExperience(1, type));
    setLoading(false);
  };

  const handleShowCreateTimeline = () => {
    setCreateTimeline(true);
  };

  const handleCloseCreateTimeline = () => {
    setCreateTimeline(false);
  };

  const handleReload = async () => {
    await clearUserExperience();
    setLoading(true);
    await dispatch(fetchUserExperience(1));
    setLoading(false);
  };

  return (
    <div className={styles.root}>
      <ShowIf condition={!menuDrawer}>
        <ShowIf condition={showFilter}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}>
            <Typography variant={'h5'} className={styles.title}>
              {userExperiencesMeta?.totalItemCount ?? 0} Timelines
            </Typography>

            <DropdownMenu<TimelineFilterCreated>
              title={i18n.t('Post_Sorting.Title_Filter')}
              options={createdFilter}
              onChange={handleFilter}
              marginTop={false}
              marginBottom={false}
              placeholder={'Select'}
            />
          </div>
        </ShowIf>

        <ShowIf condition={!showQuick && experienceType === 'user'}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 16,
            }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/experience/create')}
              style={{
                width: 'max-content',
              }}>
              {i18n.t('Experience.New.Create')}
            </Button>
          </div>
        </ShowIf>

        <ShowIf
          condition={
            Boolean(user) &&
            experienceType === 'user' &&
            !createTimeline &&
            showQuick
          }>
          <Typography
            variant={'h5'}
            color={'primary'}
            component="div"
            className={styles.action}
            onClick={handleCreateExperience}>
            <SvgIcon
              component={PlusIcon}
              viewBox="0 0 24 24"
              style={{ fontSize: 14 }}
            />
            {i18n.t('Experience.Create.Quick')}
          </Typography>
        </ShowIf>

        <ShowIf condition={createTimeline}>
          <ExperienceQuickRightBar
            onClose={handleCloseCreateTimeline}
            onSuccess={handleReload}
          />
        </ShowIf>
      </ShowIf>

      <ExperienceListContainer
        noButton={true}
        selectable
        owner={
          experienceType === 'user'
            ? ExperienceOwner.CURRENT_USER
            : ExperienceOwner.TRENDING
        }
        filterTimeline
        enableClone={experienceType === 'trending' || experienceType === 'user'}
        enableSubscribe={experienceType === 'trending'}
        hasMore={
          !menuDrawer && Boolean(user)
            ? userExperiencesMeta.currentPage <
              userExperiencesMeta.totalPageCount
            : false
        }
        loadNextPage={handleLoadNextPage}
        menuDrawer={menuDrawer}
      />

      <ShowIf condition={loading && userExperiences.length === 0}>
        <Grid container justifyContent="center">
          <Skeleton menuDrawer={menuDrawer} />
          <Skeleton menuDrawer={menuDrawer} />
          <Skeleton menuDrawer={menuDrawer} />
        </Grid>
      </ShowIf>

      <ShowIf
        condition={
          !loading && userExperiences.length === 0 && experienceType === 'user'
        }>
        <EmptyExperience />
      </ShowIf>
    </div>
  );
};

export default ExperienceTab;
