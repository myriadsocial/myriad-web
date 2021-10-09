import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {useQueryParams} from '../../hooks/use-query-params.hooks';
import {TimelineType} from '../../interfaces/timeline';
import {ExperienceTabMenu} from './ExperienceTabMenu';

import {Experience} from 'src/interfaces/experience';
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
  const {push} = useQueryParams();

  // Only load experiences specific to logged user
  const {loadExperience, experiences} = useExperienceHook();

  useEffect(() => {
    //TODO: move this to app level to avoid refetching
    loadExperience();
  }, []);

  const handleFilterTimeline = (type: TimelineType, experience: Experience) => {
    console.log('handleFilterTimeline', experience);
    push('type', type);
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
      filterTimeline={handleFilterTimeline}
      experiences={experiences}
      user={user}
    />
  );
};
