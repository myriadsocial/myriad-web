import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {useExperienceHook} from '../../hooks/use-experience-hook';
import {useQueryParams} from '../../hooks/use-query-params.hooks';
import {TimelineType} from '../../interfaces/timeline';
import {ExperienceTabMenu} from './ExperienceTabMenu';

import {Experience, UserExperience} from 'src/interfaces/experience';
import {RootState} from 'src/reducers';
import {ProfileState} from 'src/reducers/profile/reducer';
import {updateFilter} from 'src/reducers/timeline/actions';
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
  const {detail: profile} = useSelector<RootState, ProfileState>(state => state.profileState);
  const style = useStyles();
  const [toggle, setToggle] = useState<string>('');

  const dispatch = useDispatch();
  const {push} = useQueryParams();

  // Only load experiences specific to logged user
  const {loadExperience, experiences, removeExperience} = useExperienceHook();
  const [myExperience, setMyExperience] = useState<UserExperience[]>([]);

  useEffect(() => {
    //TODO: move this to app level to avoid refetching
    loadExperience();
  }, []);

  useEffect(() => {
    setMyExperience(experiences);
  }, [experiences, toggle]);

  const handleFilterTimeline = (type: TimelineType, experience: Experience) => {
    dispatch(
      updateFilter({
        people: experience.people.map(people => people.id),
        tags: experience.tags.map(tag => tag.id),
      }),
    );

    push('type', type);
  };

  const statusProfile = (): boolean | undefined => {
    if (profile && user) {
      if (profile.id == user.id) {
        return true;
      }
    }
    return;
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
      filterTimeline={handleFilterTimeline}
      filterExperience={handleFilterExperience}
      experiences={myExperience}
      user={user}
      onDelete={handleRemoveExperience}
      profileStatus={statusProfile()}
    />
  );
};
