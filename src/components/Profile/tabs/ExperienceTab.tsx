import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Grid} from '@material-ui/core';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';

import {PrivateProfile} from '../PrivateProfile';

import {EmptyExperience, ExperienceListContainer} from 'src/components/ExperienceList';
import {MenuOptions} from 'src/components/atoms/DropdownMenu';
import {DropdownMenu} from 'src/components/atoms/DropdownMenu';
import {Empty} from 'src/components/atoms/Empty';
import {ExperienceOwner} from 'src/hooks/use-experience-hook';
import {UserExperience, ExperienceType} from 'src/interfaces/experience';
import {FriendStatus} from 'src/interfaces/friend';
import {UserSettings} from 'src/interfaces/setting';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {fetchProfileExperience} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'space-beetween',
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'flex-end',
      },
    },
    mobile: {
      [theme.breakpoints.down('xs')]: {
        padding: '0px 20px',
      },
    },
  }),
);

type ProfileExperienceTabProps = {
  type?: ExperienceType;
  user?: User;
};

export const ProfileExperienceTab: React.FC<ProfileExperienceTabProps> = props => {
  const dispatch = useDispatch();
  const style = useStyles();
  const experiences = useSelector<RootState, UserExperience[]>(
    state => state.profileState.experience.data,
  );
  const {detail: profile, friendStatus} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );
  const {privacy} = useSelector<RootState, UserSettings>(state => state.configState.settings);
  const user = useSelector<RootState, User | undefined>(state => state.userState.user);

  const [isExperienceFiltered, setExperienceFiltered] = useState(false);
  const [selectedExperienceType, setSelectedExperienceType] = useState<ExperienceType>();
  const isFriend = friendStatus?.status === FriendStatus.APPROVED;
  const isProfileOwner = profile?.id == user?.id;
  const isPrivateProfile = privacy.accountPrivacy == 'private';

  const experienceFilterOptions: MenuOptions<ExperienceType>[] = [
    {id: 'all', title: i18n.t('Profile.Experience.Sort.All')},
    {id: 'personal', title: i18n.t('Profile.Experience.Sort.Personal')},
    {id: 'other', title: i18n.t('Profile.Experience.Sort.Subscribed')},
  ];

  useEffect(() => {
    dispatch(fetchProfileExperience());
  }, [user]);

  const handleFilterSelected = (selected: ExperienceType) => {
    dispatch(fetchProfileExperience(selected));

    setSelectedExperienceType(selected);
    setExperienceFiltered(true);
  };

  const refreshSelectedExperience = () => {
    dispatch(fetchProfileExperience(selectedExperienceType));
  };

  if (isPrivateProfile && !isFriend && !isProfileOwner) {
    return <PrivateProfile />;
  }

  if (experiences.length === 0 && isExperienceFiltered) {
    return <></>;
  }

  if (experiences.length === 0 && isProfileOwner) {
    return <EmptyExperience />;
  }

  if (experiences.length === 0 && !isProfileOwner) {
    return (
      <div style={{marginTop: 30}}>
        <Empty
          title={i18n.t('Profile.Experience.Empty.Title')}
          subtitle={i18n.t('Profile.Experience.Empty.Subtitle')}
        />
      </div>
    );
  }

  return (
    <div className={style.mobile}>
      <Grid container alignItems="center" className={style.root}>
        <DropdownMenu<ExperienceType>
          title={i18n.t('Profile.Experience.Sort.Title')}
          options={experienceFilterOptions}
          onChange={handleFilterSelected}
        />
      </Grid>
      <ExperienceListContainer
        refreshExperience={refreshSelectedExperience}
        selectable={false}
        enableClone
        enableSubscribe
        owner={ExperienceOwner.PROFILE}
      />
    </div>
  );
};
