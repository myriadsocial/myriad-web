import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {useExperienceHook} from '../../../hooks/use-experience-hook';
import {ExperienceTabPanel} from './ExperienceTabPanel';

import {ExperienceType} from 'src/components/Timeline/default';
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
  const router = useRouter();

  const dispatch = useDispatch();

  const experiences = useSelector<RootState, UserExperience[]>(
    state => state.profileState.experience.data,
  );

  const [toggle, setToggle] = useState<string>('');
  const [myExperience, setMyExperience] = useState<UserExperience[]>([]);

  useEffect(() => {
    dispatch(fetchProfileExperience());
  }, [user]);

  useEffect(() => {
    setMyExperience(experiences);
  }, [experiences, toggle]);

  const handleFilterExperience = (sort: string) => {
    let sortExperience;
    setToggle(sort);
    switch (sort) {
      case 'all':
        sortExperience = myExperience.sort((a, b) => {
          if (a.experience.createdAt < b.experience.createdAt) return 1;
          if (a.experience.createdAt > b.experience.createdAt) return -1;
          return 0;
        });
        setMyExperience(sortExperience);
        break;
      case 'latest':
        sortExperience = myExperience.sort((a, b) => {
          if (a.experience.createdAt < b.experience.createdAt) return -1;
          if (a.experience.createdAt > b.experience.createdAt) return 1;
          return 0;
        });
        setMyExperience(sortExperience);
        break;
      case 'aToZ':
        sortExperience = myExperience.sort((a, b) => {
          if (a.experience.name < b.experience.name) return -1;
          if (a.experience.name > b.experience.name) return 1;
          return 0;
        });
        setMyExperience(sortExperience);
        break;
      default:
        break;
    }
  };

  const handleFilterType = (type: ExperienceType) => {
    dispatch(fetchProfileExperience(type));
  };

  const handleSubsibeExperience = (experienceId: string) => {
    subscribeExperience(experienceId);
  };

  const handleUnsubscribeExperience = (experienceId: string) => {
    unsubscribeExperience(experienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/clone`);
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
      filter={handleFilterExperience}
    />
  );
};
