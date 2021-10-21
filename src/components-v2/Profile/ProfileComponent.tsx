import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './profile.style';

import {ProfileHeaderContainer} from 'src/components-v2/Profile/ProfileHeader/ProfileHeaderContainer';
import {ProfileEditContainer} from 'src/components-v2/Profile/edit/ProfileEditContainer';
import {UserMenuContainer} from 'src/components-v2/UserMenu';
import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import ShowIf from 'src/components/common/show-if.component';
import Illustration from 'src/images/UserStatusIsometric.svg';
import {User} from 'src/interfaces/user';
import {fetchProfileFriend} from 'src/reducers/profile/actions';

type Props = {
  profile: User;
  loading: boolean;
};

export const ProfileTimeline: React.FC<Props> = ({profile}) => {
  const style = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchProfileFriend());

    return undefined;
  }, [profile.id]);

  useEffect(() => {
    const section = router.query.edit as string | undefined;

    setIsEdit(!!section);
  }, [router.query]);

  const handleOpenEdit = () => {
    router.push(
      {
        pathname: `/profile/${profile.id}`,
        query: {edit: 'edit'},
      },
      undefined,
      {shallow: true},
    );
  };

  const handleCloseEdit = () => {
    setIsEdit(false);
  };

  const goHome = () => {
    router.push('/home');
  };

  if (!profile.id)
    return (
      <div className={style.root}>
        <div className={style.mb}>
          <TopNavbarComponent description={'User not found'} sectionTitle={SectionTitle.PROFILE} />
        </div>
        <div className={style.emptyUser}>
          <div className={style.illustration}>
            <Illustration />
          </div>
          <Typography className={style.text}>We cannot find user you are looking for</Typography>
          <Typography className={style.text2}>
            This user might be blocked or banned from our system
          </Typography>
          <Button onClick={goHome} variant="contained" color="primary" size="medium">
            Back to Home
          </Button>
        </div>
      </div>
    );

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

          <UserMenuContainer />
        </ShowIf>
      </div>
    </div>
  );
};
