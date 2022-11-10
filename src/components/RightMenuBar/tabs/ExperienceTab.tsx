import {PlusIcon} from '@heroicons/react/outline';

import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './Tab.style';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {ExperienceListContainer, EmptyExperience} from 'src/components/ExperienceList';
import ShowIf from 'src/components/common/show-if.component';
import {ExperienceOwner, useExperienceHook} from 'src/hooks/use-experience-hook';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';

type ExperienceTabProps = {
  experienceType?: 'user' | 'trending';
};

export const ExperienceTab: React.FC<ExperienceTabProps> = props => {
  const {experienceType = 'user'} = props;
  const router = useRouter();
  const styles = useStyles();
  const {userExperiences, userExperiencesMeta, loadNextUserExperience} = useExperienceHook();

  const user = useSelector<RootState, User | undefined>(
    state => state.userState.user,
    shallowEqual,
  );

  const enqueueSnackbar = useEnqueueSnackbar();

  const handleCreateExperience = () => {
    const totalOwnedExperience = userExperiencesMeta.additionalData?.totalOwnedExperience ?? 0;
    //TODO : ini logikanya masih dibalik
    if (!user.fullAccess) {
      if (totalOwnedExperience >= 10) {
        enqueueSnackbar({
          message: i18n.t('Experience.Alert.Max_Exp'),
          variant: 'warning',
        });
      } else {
        router.push('/experience/create');
      }
    } else {
      //TODO : add modal cta
      if (totalOwnedExperience >= 5) {
        enqueueSnackbar({
          message: 'max experiance for lite version is 5, please connect your wallet',
          variant: 'warning',
        });
      }
    }
  };

  const handleLoadNextPage = () => {
    loadNextUserExperience();
  };

  return (
    <div className={styles.box}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
        <Typography variant={'h4'} className={styles.title}>
          Experience
        </Typography>

        <ShowIf condition={Boolean(user) && experienceType === 'user'}>
          <Typography
            variant={'caption'}
            color={'primary'}
            component="div"
            className={styles.action}
            onClick={handleCreateExperience}>
            <SvgIcon component={PlusIcon} viewBox="0 0 24 24" style={{fontSize: 14}} />
            {i18n.t('Experience.Create.Title')}
          </Typography>
        </ShowIf>
      </div>

      <ExperienceListContainer
        noButton={true}
        selectable
        owner={experienceType === 'user' ? ExperienceOwner.CURRENT_USER : ExperienceOwner.TRENDING}
        filterTimeline
        enableClone={experienceType === 'trending'}
        enableSubscribe={experienceType === 'trending'}
        hasMore={
          Boolean(user)
            ? userExperiencesMeta.currentPage < userExperiencesMeta.totalPageCount
            : false
        }
        loadNextPage={handleLoadNextPage}
      />

      <ShowIf condition={userExperiences.length === 0 && experienceType === 'user'}>
        <EmptyExperience />
      </ShowIf>
    </div>
  );
};

export default ExperienceTab;
