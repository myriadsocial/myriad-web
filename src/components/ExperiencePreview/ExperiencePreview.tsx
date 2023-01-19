import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/outline';

import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {IconButton, SvgIcon, Typography} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import BaseButton from '@material-ui/core/Button';

import {PostDetailExperience} from '../PostDetailExperience/PostDetailExperience';
import {Loading} from '../atoms/Loading';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {useStyles} from './experience.style';

import {Empty} from 'components/atoms/Empty';
import {WithAuthorizeAction} from 'components/common/Authorization/WithAuthorizeAction';
import ShowIf from 'components/common/show-if.component';
import {ListItemPeopleComponent} from 'src/components/atoms/ListItem/ListItemPeople';
import {acronym} from 'src/helpers/string';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {Experience, WrappedExperience} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';
import {SocialsEnum} from 'src/interfaces/social';
import {User} from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';
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

const Button = WithAuthorizeAction(BaseButton);

export const ExperiencePreview: React.FC<Props> = props => {
  const {experience, userExperiences, onSubscribe, onUnsubscribe, onFollow, onUpdate} = props;

  const style = useStyles();
  const router = useRouter();
  const confirm = useConfirm();

  const {experiencePosts, hasMore, loadPostExperience, loadNextPostExperience} =
    useExperienceHook();

  const {anonymous, user} = useSelector<RootState, UserState>(state => state.userState);
  const [promptSignin, setPromptSignin] = React.useState(false);
  const [isExpandPeople, setIsExpandPeople] = React.useState(false);
  const [isExpandPost, setIsExpandPost] = React.useState(false);
  const [selectedUserIds, setSelectedUserIds] = React.useState<User[]>([]);
  const [pageUserIds, setPageUserIds] = React.useState<number>(1);
  const [isLoadingSelectedUser, setIsLoadingSelectedUser] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadPostExperience(experience.id);
  }, []);

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
      title: i18n.t('Experience.Alert.Confirmation_Unsub.Title'),
      description: `${i18n.t('Experience.Alert.Confirmation_Unsub.Desc_1')}\n ${i18n.t(
        'Experience.Alert.Confirmation_Unsub.Desc_2',
        {experience_name: experience.name},
      )}`,
      confirmationText: i18n.t('Experience.Alert.Confirmation_Unsub.Btn'),
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

  const handleExpandPeople = () => {
    setIsExpandPeople(!isExpandPeople);
  };

  const handleExpandPosts = () => {
    setIsExpandPost(!isExpandPost);
  };

  const handleNextPagePosts = () => {
    loadNextPostExperience(experience.id);
  };

  const checkVisibility = () => {
    if (experience?.visibility === 'private') return i18n.t('Experience.Editor.Visibility.OnlyMe');
    else if (experience?.visibility === 'public')
      return i18n.t('Experience.Editor.Visibility.Public');
    else if (experience?.visibility === 'selected_user')
      return i18n.t('Experience.Editor.Visibility.Custom');
  };

  const getSelectedIds = async (userIds: string[]) => {
    setIsLoadingSelectedUser(true);
    const response = await UserAPI.getUserByIds(userIds, pageUserIds);
    setSelectedUserIds([...selectedUserIds, ...(response?.data as unknown as User[])]);
    setIsLoadingSelectedUser(false);
    if (pageUserIds < response.meta.totalPageCount) setPageUserIds(pageUserIds + 1);
  };

  React.useEffect(() => {
    getSelectedIds(experience?.selectedUserIds);
  }, [experience, pageUserIds]);

  return (
    <div className={style.root}>
      <div className={style.experienceTopSummary}>
        {experience.experienceImageURL ? (
          <Avatar
            alt={experience.name}
            src={experience.experienceImageURL}
            variant="rounded"
            className={style.avatar}
          />
        ) : (
          <Avatar alt={experience.name} variant="rounded" className={style.avatar}>
            {experience.name.charAt(0)}
          </Avatar>
        )}

        <div className={style.experienceSummary}>
          <Typography className={style.experienceName}>{experience.name}</Typography>
          <div className={style.experienceCounterMetric}>
            <Typography component={'span'} className={style.wrapperCounter}>
              <Typography className={style.counterNumberMetric}>
                {experience.subscribedCount}
              </Typography>
              <Typography className={style.counterTextMetric}>
                &nbsp;{i18n.t('Experience.Preview.Text_1')}
              </Typography>
            </Typography>
            <Typography component={'span'} className={style.wrapperCounter}>
              <Typography className={style.counterNumberMetric}>
                {experience.clonedCount}
              </Typography>
              <Typography className={style.counterTextMetric}>
                &nbsp;{i18n.t('Experience.Preview.Text_2')}
              </Typography>
            </Typography>
          </div>
          {(experience?.createdBy !== user?.id || anonymous) && (
            <div className={style.button}>
              <Button
                disabled={isDisable()}
                variant="outlined"
                color="secondary"
                className={style.actionButton}
                onClick={handleCloneExperience}>
                {i18n.t('Experience.Preview.Button.Clone')}
              </Button>
              <Button
                disabled={isDisable()}
                variant="contained"
                color="primary"
                className={style.actionButton}
                onClick={isSubscribed() ? openUnsubscribeConfirmation : handleSubscribeExperience}>
                {isSubscribed()
                  ? i18n.t('Experience.Preview.Button.Unsubscribe')
                  : i18n.t('Experience.Preview.Button.Subscribe')}
              </Button>
            </div>
          )}

          {experience?.createdBy === user?.id && (
            <Button
              fullWidth
              className={style.editButton}
              variant="contained"
              color="primary"
              onClick={handleEditExperience}>
              {i18n.t('Experience.Preview.Button.Edit')}
            </Button>
          )}
        </div>
      </div>
      <Typography className={style.description}>{experience.description}</Typography>
      {(experience?.createdBy !== user?.id || anonymous) && (
        <div className={style.mobileButton}>
          <Button
            disabled={isDisable()}
            variant="outlined"
            color="secondary"
            className={style.actionButton}
            onClick={handleCloneExperience}>
            {i18n.t('Experience.Preview.Button.Clone')}
          </Button>
          <Button
            disabled={isDisable()}
            variant="contained"
            color="primary"
            className={style.actionButton}
            onClick={isSubscribed() ? openUnsubscribeConfirmation : handleSubscribeExperience}>
            {isSubscribed()
              ? i18n.t('Experience.Preview.Button.Unsubscribe')
              : i18n.t('Experience.Preview.Button.Subscribe')}
          </Button>
        </div>
      )}
      {experience?.createdBy === user?.id && (
        <Button
          fullWidth
          className={style.mobileEditButton}
          variant="contained"
          color="primary"
          onClick={handleEditExperience}>
          {i18n.t('Experience.Preview.Button.Edit')}
        </Button>
      )}
      <div className={style.mb30}>
        <Typography className={style.subtitle}>
          {i18n.t('Experience.Preview.Subheader.Author')}
        </Typography>
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
        <Typography className={style.subtitle}>
          {i18n.t('Experience.Preview.Subheader.Tags.Title')}
        </Typography>
        <Typography className={style.tagSection}>
          {i18n.t('Experience.Preview.Subheader.Tags.Sub_Included')}
        </Typography>
        <Typography>{parsingTags(TagsProps.ALLOWED)}</Typography>
        <Typography className={style.tagSection}>
          {i18n.t('Experience.Preview.Subheader.Tags.Sub_Excluded')}
        </Typography>
        <Typography>{parsingTags(TagsProps.PROHIBITED)}</Typography>
      </div>
      {experience?.visibility && (
        <div className={style.mb30}>
          <Typography className={style.subtitle}>
            {i18n.t('Experience.Preview.Subheader.Privacy')}
          </Typography>
          <Typography className={style.tagSection}>{checkVisibility()}</Typography>
          {experience?.visibility === 'selected_user' && (
            <div className={style.customVisibility}>
              <ShowIf condition={isLoadingSelectedUser}>
                <Loading />
              </ShowIf>
              {selectedUserIds.length > 0 &&
                selectedUserIds.map(person => (
                  <ListItemPeopleComponent
                    key={person.id}
                    onClick={() => handleOpenProfile(person as unknown as People)}
                    id="selectable-experience-list-item"
                    title={person.name}
                    subtitle={<Typography variant="caption">@{person.username}</Typography>}
                    avatar={person.profilePictureURL}
                    platform={'myriad'}
                  />
                ))}
            </div>
          )}
        </div>
      )}
      <div className={style.subtitleContainer}>
        <Typography className={style.subtitle}>
          {i18n.t('Experience.Preview.Subheader.People')}
        </Typography>
        <IconButton onClick={handleExpandPeople} color="primary" aria-label="expand">
          <SvgIcon
            component={isExpandPeople ? ChevronUpIcon : ChevronDownIcon}
            fontSize="small"
            color={'primary'}
          />
        </IconButton>
      </div>
      {isExpandPeople &&
        experience.people
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

      <div className={style.subtitleContainer}>
        <Typography className={style.subtitle}>
          {i18n.t('Experience.Preview.Subheader.Post')}
        </Typography>
        <IconButton onClick={handleExpandPosts} color="primary" aria-label="expand">
          <SvgIcon
            component={isExpandPost ? ChevronUpIcon : ChevronDownIcon}
            fontSize="small"
            color={'primary'}
          />
        </IconButton>
      </div>
      {isExpandPost && (
        <InfiniteScroll
          scrollableTarget="scrollable-searched-posts"
          dataLength={experiencePosts.length}
          hasMore={hasMore}
          next={handleNextPagePosts}
          loader={<Loading />}>
          {experiencePosts.length === 0 ? (
            <div className={style.postTextContainer}>
              <Empty
                title={i18n.t('Experience.Preview.Subheader.Post')}
                subtitle={i18n.t('Experience.Preview.Post.Empty')}
              />
            </div>
          ) : (
            experiencePosts.map(post => (
              <PostDetailExperience
                user={user}
                key={`post-${post.id}`}
                post={post}
                anonymous={anonymous}
                onImporters={() => null}
                type={'preview'}
              />
            ))
          )}
        </InfiniteScroll>
      )}

      <ExperienceSignInDialog open={promptSignin} onClose={() => setPromptSignin(false)} />
    </div>
  );
};

export default ExperiencePreview;
