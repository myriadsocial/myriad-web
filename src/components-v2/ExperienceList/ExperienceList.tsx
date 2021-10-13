import React, {useState} from 'react';

import {ExperienceListProps, useStyles} from '.';
import {SimpleCard} from '../atoms/SimpleCard';

import {Experience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';

const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences,
  isOnHomePage = false,
  user,
  filterTimeline,
  onDelete,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState(false);

  //TODO: still unable to only select one experience card
  const handleClick = () => {
    setSelected(!selected);
  };

  const handleFilterTimeline = (experience: Experience) => (type: TimelineType) => {
    filterTimeline(type, experience);
  };

  return (
    <div className={classes.root}>
      {experiences.map(item => (
        <div key={item.experience.id}>
          <SimpleCard
            filterTimeline={handleFilterTimeline(item.experience)}
            user={user}
            onClick={handleClick}
            title={item.experience.name}
            creator={item.experience.user.name}
            imgUrl={item.experience.experienceImageURL || ''}
            experienceId={item.experienceId}
            userExperienceId={item.id}
            isSelectable={isOnHomePage}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
