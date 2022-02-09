import React from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import {Experience, UserExperience} from '../../interfaces/experience';
import {People} from '../../interfaces/people';
import {SocialsEnum} from '../../interfaces/social';
import ShowIf from '../common/show-if.component';
import {useStyles} from './experience.style';

import {ListItemPeopleComponent} from 'src/components/atoms/ListItem/ListItemPeople';
import {acronym} from 'src/helpers/string';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  experience: Experience;
  userExperiences: UserExperience[];
  userId: string;
  onSubscribe: (experienceId: string) => void;
  onUnsubscribe: (userExperienceId: string) => void;
  onFollow: (experienceId: string) => void;
  onUpdate: (experienceId: string) => void;
};

export const ExperiencePreview: React.FC<Props> = props => {
  const {anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {experience, userExperiences, userId, onSubscribe, onUnsubscribe, onFollow, onUpdate} =
    props;
  const style = useStyles();
  const router = useRouter();

  console.log(anonymous);

  const parsingTags = () => {
    const list = experience.tags.map(tag => {
      return `#${tag}`;
    });
    return list.map(tag => {
      return (
        <Typography key={tag} component="span" className={style.tag}>
          {tag}
        </Typography>
      );
    });
  };

  const handleEditExperience = () => {
    onUpdate(experience.id);
  };

  const handleSubscribeExperience = () => {
    onSubscribe(experience.id);
  };

  const handleUnsubscribeExperience = () => {
    onUnsubscribe(
      userExperiences.filter(ar => ar.experienceId === experience.id && ar.subscribed === true)[0]
        .id,
    );
  };

  const isSubscribed = () => {
    return (
      userExperiences.filter(ar => ar.experienceId === experience.id && ar.subscribed === true)
        .length > 0
    );
  };

  const handleCloneExperience = () => {
    onFollow(experience.id);
  };

  const handleOpenProfile = (people: People) => {
    switch (people.platform) {
      case SocialsEnum.TWITTER:
        window.open(`https://www.twitter.com/${people.username}`);
        break;
      case SocialsEnum.REDDIT:
        window.open(`https://reddit.com/user/${people.username}`);
        break;
      default:
        router.push(`/profile/${people.id}`);
    }
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
            variant="circular"
            className={style.photo}>
            {acronym(experience.user.name)}
          </Avatar>
          <Typography className={style.user}>{experience.user.name}</Typography>
        </div>
      </div>
      <div className={style.mb30}>
        <Typography className={style.subtitle}>{'Tags'}</Typography>
        <Typography>{parsingTags()}</Typography>
      </div>
      <div>
        <Typography className={style.subtitle}>{'People'}</Typography>
        {experience.people.map(person =>
          person.id === '' ? (
            <></>
          ) : (
            <ListItemPeopleComponent
              onClick={() => handleOpenProfile(person)}
              id="selectable-experience-list-item"
              title={person.name}
              subtitle={<Typography variant="caption">@{person.username}</Typography>}
              avatar={person.profilePictureURL}
              platform={person.platform}
            />
          ),
        )}
      </div>
      <ShowIf condition={!anonymous}>
        {experience.createdBy !== userId && (
          <div className={style.button}>
            <Button variant="outlined" color="secondary" onClick={handleCloneExperience}>
              Clone
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={isSubscribed() ? handleUnsubscribeExperience : handleSubscribeExperience}>
              {isSubscribed() ? 'Unsubscribe' : 'Subscribe'}
            </Button>
          </div>
        )}
      </ShowIf>

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
