import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';

import {ExperienceTabPanel} from './ExperienceTabPanel';

import {ExperienceType} from 'src/components-v2/Timeline/default';
import {Empty} from 'src/components-v2/atoms/Empty';
import {Experience, UserExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchProfileExperience} from 'src/reducers/profile/actions';

type ExperienceTabPanelContainerProps = {
  type?: ExperienceType;
  user?: User;
};

export const ExperienceTabPanelContainer: React.FC<ExperienceTabPanelContainerProps> = props => {
  const {user} = props;
  const router = useRouter();
  const userLogin = useSelector<RootState, User | undefined>(state => state.userState.user);

  const dispatch = useDispatch();

  const experiences = useSelector<RootState, UserExperience[]>(
    state => state.profileState.experience.data,
  );

  useEffect(() => {
    dispatch(fetchProfileExperience());
  }, [user]);

  const handleFilterType = (type: ExperienceType) => {
    dispatch(fetchProfileExperience(type));
  };

  const handleFilterTimeline = (type: TimelineType, experience: Experience) => {
    // code
  };

  const handleCreateExperience = () => {
    router.push('/experience/create');
  };

  if (!experiences.length && userLogin?.id === user?.id) {
    return (
      <Empty title="Looks like you haven’t experience yet">
        <Button onClick={handleCreateExperience} variant="contained" size="small" color="primary">
          Create my experience
        </Button>
      </Empty>
    );
  }

  if (!experiences.length) {
    return <Empty title="No experience yet" subtitle="This user hasn't experience yet" />;
  }

  return (
    <ExperienceTabPanel
      experiences={experiences}
      onFilter={handleFilterType}
      onSelect={handleFilterTimeline}
    />
  );
};
