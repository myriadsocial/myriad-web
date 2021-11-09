import React from 'react';

import {List} from '@material-ui/core';

import {SearchedExperienceListProps, useStyles} from '.';
import ShowIf from '../../components/common/show-if.component';
import {EmptyResult} from '../Search/EmptyResult';
import {NonSelectableSimpleCard} from '../atoms/SimpleCard';

const SearchedExperienceList: React.FC<SearchedExperienceListProps> = ({
  experiences,
  user,
  onPreview,
  onFollow,
  onSubscribe,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ShowIf condition={experiences.length === 0}>
        <EmptyResult
          iconPath={'/images/no_experience_icon.svg'}
          heading={`
              We can’t find any related experience
            `}
          firstLineText={`
                Make sure you type correctly
              
              `}
          secondLineText={`
              or try different keywords.
              `}
        />
      </ShowIf>

      <ShowIf condition={experiences.length > 0}>
        <List className={classes.root}>
          {experiences.map(experience => (
            <div key={experience.id}>
              <NonSelectableSimpleCard
                user={user}
                experienceId={experience.id}
                title={experience.name ?? 'Unnamed Experience'}
                creator={experience.user.name ?? 'Unnamed Myrian'}
                imgUrl={
                  experience.experienceImageURL ??
                  'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg'
                }
                onSubscribe={onSubscribe}
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
