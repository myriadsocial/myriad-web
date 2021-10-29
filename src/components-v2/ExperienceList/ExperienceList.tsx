import React, {useState, useEffect} from 'react';

import {useRouter} from 'next/router';

import {ExperienceListProps, useStyles} from '.';
import {SimpleCard} from '../atoms/SimpleCard';

import {Experience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';

const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences,
  user,
  filterTimeline,
  onDelete,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState<undefined | string>(undefined);
  const [isOnHomePage, setIsOnHomePage] = useState(true);
  const router = useRouter();
  //TODO: still unable to only select one experience card
  const handleClick = (id?: string) => {
    if (id) setSelected(id);
    if (id === selected) setSelected(undefined);
  };

  const handleFilterTimeline = (experience: Experience) => (type: TimelineType) => {
    filterTimeline(type, experience);
  };

  useEffect(() => {
    if (router.pathname === '/home') setIsOnHomePage(true);
    else setIsOnHomePage(false);
  }, []);

  return (
    <div className={classes.root}>
      {experiences.map(item => (
        <div key={item.experience.id}>
          <SimpleCard
            filterTimeline={handleFilterTimeline(item.experience)}
            user={user}
            onSelect={handleClick}
            title={item.experience.name}
            creator={item.experience.user.name}
            imgUrl={item.experience.experienceImageURL || ''}
            experienceId={item.experienceId}
            userExperienceId={item.id}
            isSelectable={isOnHomePage}
            onDelete={onDelete}
            selected={selected}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
