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
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {BlockedProps, User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {fetchProfileFriend} from 'src/reducers/profile/actions';
import {checkFriendedStatus} from 'src/reducers/profile/actions';

const ProfileEditContainer = dynamic(
  () => import('src/components/ProfileEdit/ProfileEditContainer'),
  {ssr: false},
);

type ProfileProps = {
  loading: boolean;
  user: User;
  person: User & BlockedProps;
  anonymous: boolean;
  friendStatus: Friend;
};

export const Profile: React.FC<ProfileProps> = props => {
  const {user, person, anonymous, friendStatus} = props;

  const style = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const isEditing = router.query?.edit === 'edit';

  useEffect(() => {
    if (!isEditing && person?.id) {
      dispatch(fetchProfileFriend());
    }

    if (!isEditing && person?.id && !anonymous) {
      dispatch(checkFriendedStatus());
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
          <ProfileEditContainer onClose={handleCloseEdit} />
        </ShowIf>

        <ShowIf condition={!isEditing}>
          <ProfileHeaderContainer edit={handleOpenEdit} />

          <ShowIf condition={friendStatus?.status !== FriendStatus.BLOCKED}>
            <UserMenuContainer isMyriad={person.username === 'myriad_official'} />
          </ShowIf>

          <ShowIf condition={friendStatus?.status === FriendStatus.BLOCKED}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className={style.blocked}>
              <Typography variant="h4" className={style.blockedTitle}>
                {user?.id === person.blocker
                  ? i18n.t('Profile.Block.User.Title')
                  : i18n.t('Profile.Block.Other.Title')}
              </Typography>
              <ShowIf condition={user?.id === person.blocker}>
                <Typography variant="body1" component="div">
                  {i18n.t('Profile.Block.User.Subtitle')}
                </Typography>
              </ShowIf>
              <ShowIf condition={user?.id !== person.blocker}>
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
