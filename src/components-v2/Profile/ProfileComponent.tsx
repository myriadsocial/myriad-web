import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {useStyles} from './profile.style';

import {ProfileHeaderContainer} from 'src/components-v2/Profile/ProfileHeader/ProfileHeaderContainer';
import {ProfileEditContainer} from 'src/components-v2/Profile/edit/ProfileEditContainer';
import {UserMenuContainer} from 'src/components-v2/UserMenu';
import {TopNavbarComponent, SectionTitle} from 'src/components-v2/atoms/TopNavbar';
import ShowIf from 'src/components/common/show-if.component';
import {User} from 'src/interfaces/user';
import {fetchProfileFriend} from 'src/reducers/profile/actions';

type Props = {
  profile: User;
  loading: boolean;
};

export const ProfileTimeline: React.FC<Props> = ({profile}) => {
  const style = useStyles();
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchProfileFriend());

    return undefined;
  }, [profile.id]);

  const handleOpenEdit = () => {
    setIsEdit(true);
  };

  const handleCloseEdit = () => {
    setIsEdit(false);
  };

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
