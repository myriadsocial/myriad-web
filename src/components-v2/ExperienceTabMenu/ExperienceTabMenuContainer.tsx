import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {ExperienceTabMenu} from './ExperienceTabMenu';

import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {Experience, UserExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.paper,
      padding: theme.spacing(3),
      borderRadius: '20px',
      marginTop: '12px',
      height: '500px',
    },
  }),
);

export const ExperienceTabMenuContainer: React.FC = () => {
  const {anonymous, user} = useSelector<RootState, UserState>(state => state.userState);
  const style = useStyles();
  const [toggle, setToggle] = useState<string>('');

  const router = useRouter();

  // Only load experiences specific to logged user
  const {loadExperience, experiences, removeExperience} = useExperienceHook();
  const [myExperience, setMyExperience] = useState<UserExperience[]>([]);

  useEffect(() => {
    //TODO: move this to app level to avoid refetching
    if (!anonymous) {
      loadExperience();
    }
  }, [anonymous]);

  useEffect(() => {
    setMyExperience(experiences);
  }, [experiences, toggle]);

  const handleViewPostList = (type: TimelineType, experience: Experience) => {
    console.log('handleViewPostList');
    router.push(`/topic/experience?id=${experience.id}`);
  };

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

  const handleRemoveExperience = (experienceId: string) => {
    removeExperience(experienceId, () => {
      loadExperience();
    });
  };

  if (anonymous)
    return (
      <>
        <Typography variant={'h4'}>Experience</Typography>
        <div className={style.root}>
          <Typography>Please Login with polkadot account to access this feature</Typography>
        </div>
      </>
    );

  return (
    <ExperienceTabMenu
      viewPostList={handleViewPostList}
      filterExperience={handleFilterExperience}
      experiences={myExperience}
      user={user}
      onDelete={handleRemoveExperience}
    />
  );
};
