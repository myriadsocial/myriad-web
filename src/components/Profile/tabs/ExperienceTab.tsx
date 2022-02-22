import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {Grid} from '@material-ui/core';

import {PrivateProfile} from '../PrivateProfile';

import {EmptyExperience, ExperienceListContainer} from 'src/components/ExperienceList';
import {experienceFilterOptions} from 'src/components/Timeline/default';
import {DropdownMenu} from 'src/components/atoms/DropdownMenu';
import {Empty} from 'src/components/atoms/Empty';
import {ExperienceOwner} from 'src/hooks/use-experience-hook';
import {UserExperience, ExperienceType} from 'src/interfaces/experience';
import {FriendStatus} from 'src/interfaces/friend';
import {UserSettings} from 'src/interfaces/setting';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchProfileExperience} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';

type ProfileExperienceTabProps = {
  type?: ExperienceType;
  user?: User;
};

export const ProfileExperienceTab: React.FC<ProfileExperienceTabProps> = props => {
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(fetchProfileExperience());
  }, [user]);

  const handleFilterSelected = (selected: string) => {
    dispatch(fetchProfileExperience(selected as ExperienceType));

    setSelectedExperienceType(selected as ExperienceType);
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
      <Empty title="Nothing to see here!" subtitle="This user hasn't created any Experience yet." />
    );
  }

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <DropdownMenu
          title="Filter by"
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
    </>
  );
};
