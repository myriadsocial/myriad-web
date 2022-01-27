import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import {ProfileNotFound} from './ProfileNotFound';
import {useStyles} from './profile.style';

import {ProfileHeaderContainer} from 'src/components/Profile/ProfileHeader/ProfileHeaderContainer';
import {ProfileEditContainer} from 'src/components/Profile/edit/ProfileEditContainer';
import {UserMenuContainer} from 'src/components/UserMenu';
import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import ShowIf from 'src/components/common/show-if.component';
import {FriendStatus} from 'src/interfaces/friend';
import {BlockedProps, User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchProfileFriend} from 'src/reducers/profile/actions';
import {checkFriendedStatus} from 'src/reducers/profile/actions';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  profile?: User & BlockedProps;
  loading: boolean;
};

export const ProfileTimeline: React.FC<Props> = ({profile}) => {
  const style = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (profile?.id) {
      dispatch(fetchProfileFriend());
    }

    if (profile?.id && !anonymous) {
      dispatch(checkFriendedStatus());
    }

    return undefined;
  }, [profile?.id, anonymous]);

  useEffect(() => {
    const section = router.query.edit as string | undefined;
    setIsEdit(!!section);
  }, [router.query]);

  const handleOpenEdit = () => {
    router.push(
      {
        pathname: `/profile/${profile?.id}`,
        query: {edit: 'edit'},
      },
      undefined,
      {shallow: true},
    );
  };

  const handleCloseEdit = () => {
    setIsEdit(false);
  };

  if (!profile?.id) return <ProfileNotFound />;

  return (
    <div className={style.root}>
      <div className={style.scroll}>
        <div className={style.mb}>
          <TopNavbarComponent description={profile.name} sectionTitle={SectionTitle.PROFILE} />
        </div>

        <ShowIf condition={isEdit}>
          <ProfileEditContainer onClose={handleCloseEdit} />
        </ShowIf>

        <ShowIf condition={!isEdit}>
          <ProfileHeaderContainer edit={handleOpenEdit} />

          <ShowIf condition={profile.status !== FriendStatus.BLOCKED}>
            <UserMenuContainer isMyriad={profile.username === 'myriad_official'} />
          </ShowIf>

          <ShowIf condition={profile.status === FriendStatus.BLOCKED}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className={style.blocked}>
              <Typography variant="h4" className={style.blockedTitle}>
                {user?.id === profile.blocker
                  ? 'Sorry, you have blocked this user'
                  : 'Sorry, you have been blocked by this user'}
              </Typography>
              <Typography variant="body1" component="div">
                You can’t see their posts or send them a friend request. Go to setting to manage
                your block list.
              </Typography>
            </Grid>
          </ShowIf>
        </ShowIf>
      </div>
    </div>
  );
};
