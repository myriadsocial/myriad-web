import React, {useState, useEffect} from 'react';

import {useRouter} from 'next/router';

import {Experience as ExperienceCard} from '../Expericence';
import {useStyles} from './ExperienceList.style';

import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {WrappedExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';

type ExperienceListProps = {
  experiences: WrappedExperience[];
  isOnHomePage?: boolean;
  user?: User;
  anonymous?: boolean;
  selectable: boolean;
  viewPostList: (type: TimelineType, userExperience: WrappedExperience) => void;
  onSubscribe?: (experienceId: string) => void;
  onClone?: (experienceId: string) => void;
  onPreview?: (experienceId: string) => void;
  onDelete?: (experienceId: string) => void;
  onUnsubscribe?: (experienceId: string) => void;
};

export const ExperienceList: React.FC<ExperienceListProps> = props => {
  const {
    experiences,
    user,
    anonymous = false,
    selectable,
    viewPostList,
    onDelete,
    onUnsubscribe,
    onSubscribe,
    onClone,
  } = props;

  const classes = useStyles();
  const router = useRouter();

  const {getIdByType} = useQueryParams();
  const [selectedUserExperienceId, setSelectedUserExperienceId] = useState<string>();

  useEffect(() => {
    const userExperienceId = getIdByType('experience');
    const exists = experiences.find(item => item.id === userExperienceId);

    if (userExperienceId && exists) {
      setSelectedUserExperienceId(userExperienceId);
    }

    // TODO: move redirect to server side
    if (router.query?.type === 'experience' && !userExperienceId && experiences.length > 0) {
      router.push(`/home?type=experience&id=${experiences[0].id}`);
    }
  }, [router, experiences]);

  //TODO: still unable to only select one experience card
  const handleSelectExperience = (userExperience: WrappedExperience) => () => {
    if (userExperience) setSelectedUserExperienceId(userExperience.id);
    if (userExperience.id && userExperience.id === selectedUserExperienceId) {
      setSelectedUserExperienceId(undefined);
    }

    viewPostList(TimelineType.EXPERIENCE, userExperience);
  };

  return (
    <div className={classes.root}>
      {experiences.map(item => (
        <div key={item.experience.id}>
          <ExperienceCard
            user={user}
            anonymous={anonymous}
            userExperience={item}
            selected={selectedUserExperienceId === item.id}
            selectable={selectable}
            onSelect={handleSelectExperience(item)}
            onDelete={onDelete}
            onUnsubscribe={onUnsubscribe}
            onSubscribe={onSubscribe}
            onClone={onClone}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
