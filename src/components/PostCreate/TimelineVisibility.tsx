import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import NextImage from 'next/image';

import {Card, CardActionArea, CardContent, Grid, Typography} from '@material-ui/core';

import {useStyles} from './TimelineVisibility.styles';

import {Skeleton} from 'components/Expericence';
import {Avatar} from 'components/atoms/Avatar';
import {InfoIconYellow} from 'src/images/Icons';
import {Experience, UserExperience, WrappedExperience} from 'src/interfaces/experience';
import {PostVisibility} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import * as ExperienceAPI from 'src/lib/api/experience';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type ExperienceProps = {
  user?: User;
  userExperience: WrappedExperience;
  selectTimeline?: (value) => void;
  selectedTimeline?: Experience;
};

const DEFAULT_IMAGE =
  'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg';

const ExperienceCardVisibility: React.FC<ExperienceProps> = props => {
  const {userExperience, user, selectTimeline, selectedTimeline} = props;
  const styles = useStyles();

  const isOwnExperience = userExperience.experience.user.id === user?.id;
  const isSelected = selectedTimeline && selectedTimeline.id === userExperience.experience.id;

  return (
    <Card className={styles.root} style={{border: isSelected ? '1px solid #6E3FC3' : ''}}>
      {isSelected ? <div className={styles.cardActive}></div> : null}

      <CardActionArea
        onClick={() => selectTimeline(userExperience.experience)}
        disableRipple
        component="div"
        className={styles.cardAction}>
        <Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
          {userExperience.experience.experienceImageURL ? (
            <NextImage
              alt={userExperience.experience.name}
              src={userExperience.experience.experienceImageURL ?? DEFAULT_IMAGE}
              placeholder="empty"
              objectFit="cover"
              objectPosition="center"
              width={68}
              height={68}
              quality={90}
              className={styles.image}
            />
          ) : (
            <Avatar alt={userExperience.experience.name} variant="rounded" className={styles.image}>
              {userExperience.experience.name.charAt(0)}
            </Avatar>
          )}

          <CardContent classes={{root: styles.cardContent}}>
            <Typography className={styles.title} variant="body1">
              {userExperience.experience.name}
            </Typography>
            <Typography variant="subtitle2" color="primary" className={styles.subtitle}>
              {userExperience.experience.user.name}{' '}
              <Typography variant="caption" color="textSecondary">
                {isOwnExperience ? ` ${i18n.t('Experience.List.You')}` : ''}
              </Typography>
            </Typography>
            <Typography className={styles.subtitle} variant="subtitle2">
              {`${i18n.t('Post_Create.Visibility.Label')} : `}
              {userExperience.experience.visibility === PostVisibility.FRIEND
                ? i18n.t('Post_Create.Visibility.Friend_Only')
                : userExperience.experience.visibility === PostVisibility.TIMELINE
                ? i18n.t('Post_Create.Visibility.Only_Me')
                : userExperience.experience.visibility === PostVisibility.CUSTOM
                ? i18n.t('Post_Create.Visibility.Custom')
                : userExperience.experience.visibility === PostVisibility.TIMELINE
                ? i18n.t('Post_Create.Visibility.Timeline')
                : i18n.t('Post_Create.Visibility.Public')}
            </Typography>
          </CardContent>
        </Grid>
      </CardActionArea>
    </Card>
  );
};

const TimelineVisibility = props => {
  const {setPost, pageType} = props;
  const styles = useStyles();
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const [userExperiences, setUserExperiences] = useState<UserExperience[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTimeline, setSelectedTimeline] = useState<Experience>();

  const handleSelectedTimeline = (value: Experience) => {
    setSelectedTimeline(value);
    if (pageType === 'create') {
      setPost(prevPost => ({
        ...prevPost,
        selectedTimelineIds: [value.id],
      }));
    } else {
      setPost(value);
    }
  };

  const fetchUserExperiences = async () => {
    setLoading(true);
    const {meta, data: experiences} = await ExperienceAPI.getUserExperiences(
      user.id,
      undefined,
      page,
    );

    setUserExperiences([...userExperiences, ...experiences]);
    setLoading(false);
    if (meta.currentPage < meta.totalPageCount) setPage(page + 1);
  };

  useEffect(() => {
    fetchUserExperiences();
  }, [page]);

  return (
    <>
      <Typography className={styles.title} variant="h4">
        {i18n.t('Post_Create.Visibility.SelectedTimeline')}
      </Typography>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 10,
          marginTop: 10,
          backgroundColor: '#FFC85733',
          padding: '6px 10px',
          columnGap: '10px',
        }}>
        <InfoIconYellow />
        <Typography style={{fontSize: 12, color: '#404040'}}>
          {i18n.t('Post_Create.Visibility.AlertTimeline')}
        </Typography>
      </div>
      <div>
        {userExperiences
          .filter(ar => ar.userId === user?.id && ar.subscribed === false)
          .map(item => {
            return (
              <ExperienceCardVisibility
                key={item.id}
                userExperience={item}
                user={user}
                selectedTimeline={selectedTimeline}
                selectTimeline={handleSelectedTimeline}
              />
            );
          })}
        {loading && <Skeleton />}
      </div>
    </>
  );
};

export default TimelineVisibility;
