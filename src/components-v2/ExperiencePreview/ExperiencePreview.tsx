import React from 'react';

import {Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import {Experience} from '../..//interfaces/experience';
import {useStyles} from './experience.style';

import {acronym} from 'src/helpers/string';

type Props = {
  experience: Experience;
  userId: string;
  onSubscribe: (experienceId: string) => void;
  onFollow: (experienceId: string) => void;
  onUpdate: (experienceId: string) => void;
};

export const ExperiencePreview: React.FC<Props> = props => {
  const {experience, userId, onSubscribe, onFollow, onUpdate} = props;
  const style = useStyles();

  const parcingTags = () => {
    return experience.tags
      .map(tag => {
        return `#${tag}`;
      })
      .join(' ');
  };

  const handleEditExperience = () => {
    onUpdate(experience.id);
  };

  const handleSubscribeExperience = () => {
    onSubscribe(experience.id);
  };

  const handleCloneExperience = () => {
    onFollow(experience.id);
  };

  return (
    <div className={style.root}>
      <div className={style.mb30}>
        <Avatar
          alt={experience.name}
          src={experience.experienceImageURL}
          variant="rounded"
          className={style.avatar}
        />
        <Typography className={style.experienceName}>{experience.name}</Typography>
        <Typography className={style.description}>{experience.description}</Typography>
      </div>
      <div className={style.mb30}>
        <Typography className={style.subtitle}>{'Author'}</Typography>
        <div className={style.flex}>
          <Avatar
            alt={experience.user.name}
            src={experience.user.profilePictureURL}
            variant="circle"
            className={style.photo}>
            {acronym(experience.user.name)}
          </Avatar>
          <Typography className={style.user}>{experience.user.name}</Typography>
        </div>
      </div>
      <div className={style.mb30}>
        <Typography className={style.subtitle}>{'Tags'}</Typography>
        <Typography className={style.tag}>{parcingTags()}</Typography>
      </div>
      <div>
        <Typography className={style.subtitle}>{'People'}</Typography>
        {experience.people.map(person => (
          <ListItem key={person.id} classes={{root: style.list}}>
            <ListItemAvatar>
              <Avatar src={person.profilePictureURL} />
            </ListItemAvatar>
            <ListItemText primary={person.name} secondary={person.platform} />
          </ListItem>
        ))}
      </div>
      {experience.createdBy !== userId && (
        <div className={style.button}>
          <Button variant="outlined" color="secondary" onClick={handleCloneExperience}>
            Clone
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubscribeExperience}>
            Subscribe
          </Button>
        </div>
      )}
      {experience.createdBy === userId && (
        <Button
          fullWidth
          className={style.center}
          variant="outlined"
          color="secondary"
          onClick={handleEditExperience}>
          Edit experience
        </Button>
      )}
    </div>
  );
};
