import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {useExperienceHook} from '../../../hooks/use-experience-hook';
import {ExperienceTabPanel} from './ExperienceTabPanel';

import {ExperienceType} from 'src/components/Timeline/default';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {UserExperience} from 'src/interfaces/experience';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchProfileExperience} from 'src/reducers/profile/actions';

type ExperienceTabPanelContainerProps = {
  type?: ExperienceType;
  user?: User;
};

export const ExperienceTabPanelContainer: React.FC<ExperienceTabPanelContainerProps> = props => {
  const {user} = props;
  const {
    subscribeExperience,
    unsubscribeExperience,
    experiences: userExperience,
  } = useExperienceHook();
  const {openToasterSnack} = useToasterSnackHook();
  const router = useRouter();

  const dispatch = useDispatch();

  const experiences = useSelector<RootState, UserExperience[]>(
    state => state.profileState.experience.data,
  );

  const [myExperience, setMyExperience] = useState<UserExperience[]>([]);

  useEffect(() => {
    dispatch(fetchProfileExperience());
  }, [user]);

  useEffect(() => {
    setMyExperience(experiences);
  }, [experiences]);

  const handleFilterType = (type: ExperienceType) => {
    dispatch(fetchProfileExperience(type));
  };

  const handleSubsibeExperience = (experienceId: string) => {
    if (userExperience.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      subscribeExperience(experienceId);
    }
  };

  const handleUnsubscribeExperience = (experienceId: string) => {
    unsubscribeExperience(experienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    if (userExperience.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handlePreviewExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/preview`);
  };

  return (
    <ExperienceTabPanel
      experiences={myExperience}
      userExperience={userExperience}
      onFilter={handleFilterType}
      onSubscribe={handleSubsibeExperience}
      onUnsubscribe={handleUnsubscribeExperience}
      onFollow={handleCloneExperience}
      onPreview={handlePreviewExperience}
    />
  );
};
