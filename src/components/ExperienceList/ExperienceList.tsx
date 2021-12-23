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
  onUnsubscribe,
  onFollow,
}) => {
  const classes = useStyles();

  const router = useRouter();

  const [selected, setSelected] = useState<undefined | string>(undefined);

  //TODO: still unable to only select one experience card
  const handleClick = (id?: string) => {
    if (id) setSelected(id);
    if (id === selected) setSelected(undefined);
  };

  const handleViewExperience = (experience: Experience) => (type: TimelineType) => {
    viewPostList(type, experience);
  };

  useEffect(() => {
    // TODO: make experience as global constant for helper query instead hardcoded
    if (router.query?.type === 'experience') {
      let idSelected = undefined;
      if (router.query.id) {
        idSelected = router.query?.id?.toString();
      } else {
        if (experiences.length > 0) {
          router.push(`/home?type=experience&id=${experiences[0].experienceId}`);
        }
      }
      setSelected(idSelected);
    } else {
      setSelected(undefined);
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
            subscribed={item.subscribed}
            imgUrl={item.experience.experienceImageURL || ''}
            experienceId={item.experienceId}
            userExperienceId={item.id}
            isSelectable={true}
            onDelete={onDelete}
            onUnsubscribe={onUnsubscribe}
            onFollow={onFollow}
            selected={selected}
          />
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;
