import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { Experience as ExperienceCard } from '../Expericence';
import { useStyles } from './ExperienceList.style';

import { useQueryParams } from 'src/hooks/use-query-params.hooks';
import { WrappedExperience } from 'src/interfaces/experience';
import { TimelineType } from 'src/interfaces/timeline';
import { User } from 'src/interfaces/user';

type ExperienceListDiscoverProps = {
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

export const ExperienceListDiscover: React.FC<ExperienceListDiscoverProps> =
  props => {
    const {
      experiences,
      user,
      anonymous = false,
      selectable,
      onDelete,
      onUnsubscribe,
      onSubscribe,
      onClone,
    } = props;

    const classes = useStyles();
    const router = useRouter();

    const { getIdByType } = useQueryParams();
    const [selectedExperienceId, setSelectedExperienceId] = useState<string>();

    useEffect(() => {
      const experienceId = getIdByType('experience');
      const exists = experiences.find(item => item.id === experienceId);

      if (experienceId && exists) {
        setSelectedExperienceId(experienceId);
      } else {
        setSelectedExperienceId(undefined);
      }
    }, [router, experiences]);

    const handleSelectExperience =
      (userExperience: WrappedExperience) => () => {
        router.push(`/experience/${userExperience.experience.id}`);
      };

    return (
      <div className={classes.root}>
        {experiences.map(item => (
          <div key={item.experience.id}>
            <ExperienceCard
              user={user}
              anonymous={anonymous}
              userExperience={item}
              selected={
                Boolean(selectedExperienceId) &&
                selectedExperienceId === item.experience.id
              }
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

export default ExperienceListDiscover;
