import React from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import {Experience, WrappedExperience} from '../../interfaces/experience';
import {People} from '../../interfaces/people';
import {SocialsEnum} from '../../interfaces/social';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {useStyles} from './experience.style';

import {ListItemPeopleComponent} from 'src/components/atoms/ListItem/ListItemPeople';
import {acronym} from 'src/helpers/string';
import {useAuthHook} from 'src/hooks/auth.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  experience: Experience;
  userExperiences: WrappedExperience[];
  userId: string;
  onSubscribe: (experienceId: string) => void;
  onUnsubscribe: (userExperienceId: string) => void;
  onFollow: (experienceId: string) => void;
  onUpdate: (experienceId: string) => void;
};

export const ExperiencePreview: React.FC<Props> = props => {
  const {anonymous, user} = useSelector<RootState, UserState>(state => state.userState);
  const {experience, userExperiences, onSubscribe, onUnsubscribe, onFollow, onUpdate} = props;
  const {logout} = useAuthHook();
  const style = useStyles();
  const router = useRouter();
  const [promptSignin, setPromptSignin] = React.useState(false);

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
    if (anonymous) {
      setPromptSignin(true);
    } else {
      onSubscribe(experience.id);
    }
  };

  const handleUnsubscribeExperience = () => {
    const subscribedExperience = userExperiences.find(
      ar => ar.experience.id === experience.id && ar.subscribed === true,
    );

    if (subscribedExperience && subscribedExperience.id && onUnsubscribe) {
      onUnsubscribe(subscribedExperience.id);
    }
  };

  const isSubscribed = () => {
    return (
      userExperiences.filter(ar => ar.experience.id === experience.id && ar.subscribed === true)
        .length > 0
    );
  };

  const handleCloneExperience = () => {
    if (anonymous) {
      setPromptSignin(true);
    } else {
      onFollow(experience.id);
    }
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
      {(experience?.createdBy !== user?.id || anonymous) && (
        <div className={style.button}>
          <Button
            variant="outlined"
            color="secondary"
            style={{marginRight: '12px'}}
            onClick={handleCloneExperience}>
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

      {experience?.createdBy === user?.id && (
        <Button
          fullWidth
          className={style.center}
          variant="outlined"
          color="secondary"
          onClick={handleEditExperience}>
          Edit experience
        </Button>
      )}

      <PromptComponent
        title={'Start your Experience!'}
        subtitle={'When you join Myriad, you can create, subscribe, or clone \n an experience.'}
        open={promptSignin}
        icon="warning"
        onCancel={() => {
          setPromptSignin(false);
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            style={{marginRight: '12px'}}
            onClick={() => {
              setPromptSignin(false);
            }}>
            Back
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              setPromptSignin(false);
              logout();
            }}>
            Sign in
          </Button>
        </div>
      </PromptComponent>
    </div>
  );
};
