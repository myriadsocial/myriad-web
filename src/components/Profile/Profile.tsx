import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import {ProfileNotFound} from '../ProfileNotFound/ProfileNotFound';
import {useStyles} from './Profile.style';

import {ProfileHeaderContainer} from 'src/components/ProfileHeader/ProfileHeaderContainer';
import {UserMenuContainer} from 'src/components/UserMenu';
import ShowIf from 'src/components/common/show-if.component';
import InfoIconYellow from 'src/images/Icons/InfoIconYellow.svg';
import {FriendStatus} from 'src/interfaces/friend';
import {FriendStatusProps, User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {fetchProfileFriend} from 'src/reducers/profile/actions';

const ProfileEditContainer = dynamic(
  () => import('src/components/ProfileEdit/ProfileEditContainer'),
  {ssr: false},
);

type ProfileProps = {
  loading: boolean;
  user: User;
  person: User & FriendStatusProps;
  anonymous: boolean;
};

export const Profile: React.FC<ProfileProps> = props => {
  const {user, person, anonymous} = props;

  const style = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const isEditing = router.query?.edit === 'edit' && Boolean(user);

  useEffect(() => {
    if (!isEditing && person?.id) {
      dispatch(fetchProfileFriend());
    }

    return undefined;
  }, [person?.id, anonymous, isEditing]);

  const handleOpenEdit = () => {
    router.push(
      {
        pathname: `/profile/${person?.id}`,
        query: {edit: 'edit'},
      },
      undefined,
      {shallow: true},
    );
  };

  const handleCloseEdit = () => {
    router.push(
      {
        pathname: `/profile/${person?.id}`,
      },
      undefined,
      {shallow: true},
    );
  };

  if (!person?.id) return <ProfileNotFound />;

  return (
    <div className={style.root}>
      <div className={style.scroll}>
        <ShowIf condition={isEditing}>
          <ShowIf condition={!user?.fullAccess && user?.fullAccess !== undefined}>
            <div
              style={{
                backgroundColor: '#ffc85726',
                padding: 10,
                borderRadius: 8,
                fontSize: 14,
                display: 'flex',
                alignItems: 'start',
                marginBottom: 16,
              }}>
              <div style={{marginRight: 8, marginTop: 4}}>
                <InfoIconYellow />
              </div>
              <Typography>{i18n.t('LiteVersion.DisclaimerEditProfile')}</Typography>
            </div>
          </ShowIf>
          <ProfileEditContainer onClose={handleCloseEdit} />
        </ShowIf>

        <ShowIf condition={!isEditing}>
          <ProfileHeaderContainer edit={handleOpenEdit} />

          <ShowIf condition={person?.status !== FriendStatus.BLOCKED}>
            <UserMenuContainer isMyriad={person.username === 'myriad_official'} />
          </ShowIf>

          <ShowIf condition={person?.status === FriendStatus.BLOCKED}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className={style.blocked}>
              <Typography variant="h4" className={style.blockedTitle}>
                {user?.id === person.requester
                  ? i18n.t('Profile.Block.User.Title')
                  : i18n.t('Profile.Block.Other.Title')}
              </Typography>
              <ShowIf condition={user?.id === person.requester}>
                <Typography variant="body1" component="div">
                  {i18n.t('Profile.Block.User.Subtitle')}
                </Typography>
              </ShowIf>
              <ShowIf condition={user?.id !== person.requester}>
                <Typography variant="body1" component="div">
                  {i18n.t('Profile.Block.Other.Subtitle')}
                </Typography>
              </ShowIf>
            </Grid>
          </ShowIf>
        </ShowIf>
      </div>
    </div>
  );
};
