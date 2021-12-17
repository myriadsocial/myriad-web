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

  const router = useRouter();

  // Only load experiences specific to logged user
  const {loadExperience, experiences, removeExperience, unsubscribeExperience} =
    useExperienceHook();
  const [myExperience, setMyExperience] = useState<UserExperience[]>([]);

  useEffect(() => {
    //TODO: move this to app level to avoid refetching
    if (!anonymous) {
      loadExperience();
    }
  }, [anonymous]);

  useEffect(() => {
    setMyExperience(experiences);
  }, [experiences]);

  const handleViewPostList = (type: TimelineType, experience: Experience) => {
    router.push(`/topic/experience?id=${experience.id}`);
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
      experiences={myExperience}
      user={user}
      onDelete={handleRemoveExperience}
      onUnsubscribe={handleUnsubscribeExperience}
    />
  );
};
