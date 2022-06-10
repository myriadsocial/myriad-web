import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {Grid} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import {ProfileNotFound} from '../ProfileNotFound/ProfileNotFound';
import {useStyles} from './Profile.style';

import {ProfileHeaderContainer} from 'src/components/ProfileHeader/ProfileHeaderContainer';
import {UserMenuContainer} from 'src/components/UserMenu';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import ShowIf from 'src/components/common/show-if.component';
import {FriendStatus} from 'src/interfaces/friend';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {fetchProfileFriend} from 'src/reducers/profile/actions';
import {checkFriendedStatus} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

const ProfileEditContainer = dynamic(
  () => import('src/components/ProfileEdit/ProfileEditContainer'),
  {ssr: false},
);

type Props = {
  loading: boolean;
  isBanned?: boolean;
};

export const ProfileTimeline: React.FC<Props> = ({loading, isBanned = false}) => {
  const style = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {detail: profile, friendStatus} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );
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
    <div className={style.root} style={{display: isBanned ? 'none' : 'block'}}>
      <div className={style.scroll}>
        <div className={style.mb}>
          <TopNavbarComponent
            sectionTitle={profile.name}
            description={i18n.t('TopNavbar.Title.Profile')}
          />
        </div>

        <ShowIf condition={isEdit}>
          <ProfileEditContainer onClose={handleCloseEdit} />
        </ShowIf>

        <ShowIf condition={!isEdit}>
          <ProfileHeaderContainer edit={handleOpenEdit} />
          <ShowIf condition={friendStatus?.status !== FriendStatus.BLOCKED}>
            <UserMenuContainer isMyriad={profile.username === 'myriad_official'} />
          </ShowIf>
          <ShowIf condition={friendStatus?.status === FriendStatus.BLOCKED}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              className={style.blocked}>
              <Typography variant="h4" className={style.blockedTitle}>
                {user?.id === profile.blocker
                  ? i18n.t('Profile.Block.User.Title')
                  : i18n.t('Profile.Block.Other.Title')}
              </Typography>
              <ShowIf condition={user?.id === profile.blocker}>
                <Typography variant="body1" component="div">
                  {i18n.t('Profile.Block.User.Subtitle')}
                </Typography>
              </ShowIf>
              <ShowIf condition={user?.id !== profile.blocker}>
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
