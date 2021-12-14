import React, {useState, useEffect} from 'react';

import {useRouter} from 'next/router';

import {ExperienceListProps, useStyles} from '.';
import {SimpleCard} from '../atoms/SimpleCard';

import {Experience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';

const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences,
  user,
  viewPostList,
  onDelete,
}) => {
  const classes = useStyles();

  const router = useRouter();

  const [selected, setSelected] = useState<undefined | string>(undefined);
  const [selectable, setSelectable] = useState(true);

  //TODO: still unable to only select one experience card
  const handleClick = (id?: string) => {
    if (id) setSelected(id);
    if (id === selected) setSelected(undefined);
  };

  const handleViewExperience = (experience: Experience) => (type: TimelineType) => {
    console.log('handleViewExperience', experience);
    viewPostList(type, experience);
  };

  useEffect(() => {
    if (['/home', '/topic/[type]'].includes(router.route)) setSelectable(true);
    else setSelectable(false);
  }, []);

  useEffect(() => {
    // TODO: make experience as global constant for helper query instead hardcoded
    if (router.query?.type === 'experience') {
      const idSelected = router.query?.id?.toString();
      setSelected(idSelected);
    }
  }, [router]);

  return (
    <div className={classes.root}>
      {experiences.map(item => (
        <div key={item.experience.id}>
          <SimpleCard
            filterTimeline={handleViewExperience(item.experience)}
            user={user}
            onSelect={handleClick}
            title={item.experience.name}
            creator={item.experience.user.name}
            imgUrl={item.experience.experienceImageURL || ''}
            experienceId={item.experienceId}
            userExperienceId={item.id}
            isSelectable={selectable}
            onDelete={onDelete}
            selected={selected}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
