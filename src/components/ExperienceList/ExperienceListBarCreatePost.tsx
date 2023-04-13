import React, { useState } from 'react';

import { Experience as ExperienceCard } from '../ExpericenceRightBar';
import { useStyles } from './ExperienceList.style';

import { WrappedExperience } from 'src/interfaces/experience';
import { TimelineType } from 'src/interfaces/timeline';
import { User } from 'src/interfaces/user';

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

export const ExperienceListBarCreatePost: React.FC<ExperienceListProps> =
  props => {
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
    const [selectedExperienceIds, setSelectedExperienceIds] = useState<
      string[]
    >([]);

    //TODO: still unable to only select one experience card
    const handleSelectExperience =
      (userExperience: WrappedExperience) => () => {
        if (userExperience) {
          if (selectedExperienceIds.includes(userExperience.experience.id)) {
            setSelectedExperienceIds(
              selectedExperienceIds.filter(
                id => id !== userExperience.experience.id,
              ),
            );
          } else {
            setSelectedExperienceIds([
              ...selectedExperienceIds,
              userExperience.experience.id,
            ]);
          }
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
              selected={
                Boolean(selectedExperienceIds.length) &&
                selectedExperienceIds.includes(item.experience.id)
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

export default ExperienceListBarCreatePost;
