import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ExperienceTabMenu} from './ExperienceTabMenu';

import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Experience, UserExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ExperienceTabMenuContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const router = useRouter();

  // Only load experiences specific to logged user
  const {loadExperience, experiences, removeExperience, unsubscribeExperience} =
    useExperienceHook();
  const {openToasterSnack} = useToasterSnackHook();
  const [myExperience, setMyExperience] = useState<UserExperience[]>([]);

  useEffect(() => {
    setMyExperience(experiences);
  }, [experiences]);

  const handleViewPostList = (type: TimelineType, experience: Experience) => {
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

  const handleUnsubscribeExperience = (experienceId: string) => {
    unsubscribeExperience(experienceId, () => {
      loadExperience();
    });
  };

  const handleCloneExperience = (experienceId: string) => {
    if (experiences.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handleCreateExperience = () => {
    if (experiences.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push('/experience/create');
    }
  };

  return (
    <ExperienceTabMenu
      viewPostList={handleViewPostList}
      experiences={myExperience}
      user={user}
      onDelete={handleRemoveExperience}
      onUnsubscribe={handleUnsubscribeExperience}
      onCreateExperience={handleCreateExperience}
      onCloneExperience={handleCloneExperience}
    />
  );
};
