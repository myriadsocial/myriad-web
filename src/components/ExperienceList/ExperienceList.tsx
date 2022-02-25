import React, {useState, useEffect} from 'react';

import {useRouter} from 'next/router';

import {Experience as ExperienceCard} from '../Expericence';
import {useStyles} from './ExperienceList.style';

import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {Experience, WrappedExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {User} from 'src/interfaces/user';

type ExperienceListProps = {
  experiences: WrappedExperience[];
  isOnHomePage?: boolean;
  user?: User;
  anonymous?: boolean;
  selectable: boolean;
  viewPostList: (type: TimelineType, experience: Experience) => void;
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
  const [selected, setSelected] = useState<null | string>(null);

  useEffect(() => {
    const experienceId = getIdByType('experience');
    const exists = experiences.find(item => item.experience.id === experienceId);

    if (experienceId && exists) {
      setSelected(experienceId);
    }

    // TODO: move redirect to server side
    if (router.query?.type === 'experience' && !experienceId && experiences.length > 0) {
      router.push(`/home?type=experience&id=${experiences[0].experience.id}`);
    }
  }, [router]);

  //TODO: still unable to only select one experience card
  const handleSelectExperience = (experience: Experience) => (id?: string) => {
    if (id) setSelected(id);
    if (id === selected) setSelected(null);

    viewPostList(TimelineType.EXPERIENCE, experience);
  };

  return (
    <div className={classes.root}>
      {experiences.map(item => (
        <div key={item.experience.id}>
          <ExperienceCard
            user={user}
            anonymous={anonymous}
            userExperience={item}
            selected={selected === item.experience.id}
            selectable={selectable}
            onSelect={handleSelectExperience(item.experience)}
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
