import React from 'react';

import {List} from '@material-ui/core';

import {SearchedExperienceListProps, useStyles} from '.';
import {EmptyResult} from '../Search/EmptyResult';
import {EmptyContentEnum} from '../Search/EmptyResult.interfaces';
import {NonSelectableSimpleCard} from '../atoms/SimpleCard';
import ShowIf from '../common/show-if.component';

const SearchedExperienceList: React.FC<SearchedExperienceListProps> = ({
  experiences,
  userExperience,
  onPreview,
  onFollow,
  onSubscribe,
  onUnsubscribe,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ShowIf condition={experiences.length === 0}>
        <EmptyResult emptyContent={EmptyContentEnum.EXPERIENCE} />
      </ShowIf>

      <ShowIf condition={experiences.length > 0}>
        <List className={classes.root}>
          {experiences.map(experience => (
            <div key={experience.id}>
              <NonSelectableSimpleCard
                ownerId={experience.user.id}
                experienceId={experience.id}
                userExperience={userExperience}
                title={experience.name ?? 'Unnamed Experience'}
                creator={experience.user.name ?? 'Unnamed Myrian'}
                imgUrl={
                  experience.experienceImageURL ??
                  'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg'
                }
                onSubscribe={onSubscribe}
                onUnsubscribe={onUnsubscribe}
                onFollow={onFollow}
                onPreview={onPreview}
              />
            </div>
          ))}
        </List>
      </ShowIf>
    </div>
  );
};

export default SearchedExperienceList;
