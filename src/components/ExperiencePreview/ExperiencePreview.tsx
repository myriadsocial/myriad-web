import React from 'react';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {useStyles} from './experience.style';

import {ListItemPeopleComponent} from 'src/components/atoms/ListItem/ListItemPeople';
import {acronym} from 'src/helpers/string';
import {Experience, WrappedExperience} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';
import {SocialsEnum} from 'src/interfaces/social';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const ExperienceSignInDialog = dynamic(() => import('./ExperienceSignIn'), {ssr: false});

type Props = {
  experience: Experience;
  userExperiences: WrappedExperience[];
  userId: string;
  onSubscribe: (experienceId: string) => void;
  onUnsubscribe: (userExperienceId: string) => void;
  onFollow: (experienceId: string) => void;
  onUpdate: (experienceId: string) => void;
};

enum TagsProps {
  ALLOWED = 'allowed',
  PROHIBITED = 'prohibited',
}

export const ExperiencePreview: React.FC<Props> = props => {
  const {experience, userExperiences, onSubscribe, onUnsubscribe, onFollow, onUpdate} = props;

  const style = useStyles();
  const router = useRouter();
  const confirm = useConfirm();

  const {anonymous, user} = useSelector<RootState, UserState>(state => state.userState);
  const [promptSignin, setPromptSignin] = React.useState(false);

  const parsingTags = (type: TagsProps) => {
    let listTags: string[] = [];
    if (type === TagsProps.ALLOWED) {
      listTags = experience.allowedTags.map(tag => {
        return `#${tag}`;
      });
    } else if (type === TagsProps.PROHIBITED && experience?.prohibitedTags) {
      listTags = experience.prohibitedTags.map(tag => {
        return `#${tag}`;
      });
    }

    return listTags.map(tag => {
      return (
        <Typography
          key={tag}
          component="span"
          className={type === TagsProps.ALLOWED ? style.allowedTag : style.prohibitedTag}>
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

  const openUnsubscribeConfirmation = () => {
    confirm({
      title: 'Unsubscribe?',
      description: "Do you want to unsubscribe?\n You won't see more post from this experience",
      confirmationText: 'Unsubscribe',
      onConfirm: () => {
        const subscribedExperience = userExperiences.find(
          ar => ar.experience.id === experience.id && ar.subscribed === true,
        );

        if (subscribedExperience && subscribedExperience.id && onUnsubscribe) {
          onUnsubscribe(subscribedExperience.id);
        }
      },
    });
  };

  const isDisable = () => {
    if (isSubscribed()) return false;
    if (experience.private && !experience.friend) return true;
    if (experience.private && experience.friend) return false;
    return false;
  };

  return (
    <div className={style.root}>
      <div className={style.experienceTopSummary}>
        <Avatar
          alt={experience.name}
          src={experience.experienceImageURL}
          variant="rounded"
          className={style.avatar}
        />
        <div className={style.experienceSummary}>
          <Typography className={style.experienceName}>{experience.name}</Typography>
          <div className={style.experienceCounterMetric}>
            <Typography component={'span'} className={style.wrapperCounter}>
              <Typography className={style.counterNumberMetric}>
                {experience.subscribedCount}
              </Typography>
              <Typography className={style.counterTextMetric}>&nbsp;subscribers</Typography>
            </Typography>
            <Typography component={'span'} className={style.wrapperCounter}>
              <Typography className={style.counterNumberMetric}>
                {experience.clonedCount}
              </Typography>
              <Typography className={style.counterTextMetric}>&nbsp;cloners</Typography>
            </Typography>
          </div>
          {(experience?.createdBy !== user?.id || anonymous) && (
            <div className={style.button}>
              <Button
                disabled={isDisable()}
                variant="outlined"
                color="secondary"
                className={style.clone}
                onClick={handleCloneExperience}>
                Clone
              </Button>
              <Button
                disabled={isDisable()}
                variant="contained"
                color="primary"
                className={style.subscribe}
                onClick={isSubscribed() ? openUnsubscribeConfirmation : handleSubscribeExperience}>
                {isSubscribed() ? 'Unsubscribe' : 'Subscribe'}
              </Button>
            </div>
          )}

          {experience?.createdBy === user?.id && (
            <Button
              fullWidth
              className={style.center}
              variant="contained"
              color="primary"
              onClick={handleEditExperience}>
              Edit experience
            </Button>
          )}
        </div>
      </div>
      <Typography className={style.description}>{experience.description}</Typography>
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
        <Typography className={style.tagSection}>{'Included tag'}</Typography>
        <Typography>{parsingTags(TagsProps.ALLOWED)}</Typography>
        <Typography className={style.tagSection}>{'Excluded tag'}</Typography>
        <Typography>{parsingTags(TagsProps.PROHIBITED)}</Typography>
      </div>
      <div>
        <Typography className={style.subtitle}>{'People'}</Typography>
        {experience.people
          .filter(ar => Boolean(ar.deletedAt) === false)
          .filter(ar => ar.id !== null && ar.id !== '')
          .map(person => (
            <ListItemPeopleComponent
              key={person.id}
              onClick={() => handleOpenProfile(person)}
              id="selectable-experience-list-item"
              title={person.name}
              subtitle={<Typography variant="caption">@{person.username}</Typography>}
              avatar={person.profilePictureURL}
              platform={person.platform}
            />
          ))}
      </div>

      <ExperienceSignInDialog open={promptSignin} onClose={() => setPromptSignin(false)} />
    </div>
  );
};

export default ExperiencePreview;
