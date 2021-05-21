import React from 'react';

import { User } from 'next-auth';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import ShowIf from '../common/show-if.component';
import { useStyles } from './header.style';

// import { useProfileHook } from './use-profile.hook';
import { WithAdditionalParams } from 'next-auth/_utils';
import { acronym } from 'src/helpers/string';
// import { EditableTextField } from 'src/components/common/EditableTextField';
import { ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: WithAdditionalParams<User>;
  profile: ExtendedUserPost | null;
  loading: Boolean;
  isGuest: Boolean;
};

export default function Header({ user, profile, loading, isGuest }: Props) {
  const style = useStyles();
  // const { updateProfile } = useProfileHook(user.id);

  // const profileInfo =
  //   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae nibh eu tellus tincidunt luctus hendrerit in orci. Phasellus vitae tristique nulla. Nam magna massa, sollicitudin sed turpis eros.';

  // const updateProfileBio = (value: string) => {
  //   updateProfile({
  //     bio: value
  //   });
  // };

  return (
    <div className="header" style={{ marginBottom: 10, position: 'relative' }}>
      <CardMedia
        className={style.media}
        image="https://images.pexels.com/photos/3394939/pexels-photo-3394939.jpeg"
        title={profile?.name || 'Avatar'}
      />
      <div className={style.header}>
        <div className="leftSide" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ position: 'relative', width: 100, height: 100, marginRight: 10 }}>
            {/* <div className={style.avatar}>
              <span>😘</span>
            </div> */}
            <Avatar className={style.avatar} src={profile?.profilePictureURL}>
              {acronym(profile?.name || '')}
            </Avatar>
          </div>
          <div className="Keterangan" style={{ width: 300, wordWrap: 'break-word' }}>
            <Typography className={style.name}>{profile?.name}</Typography>
            <Typography className={style.publicKey}>
              {/* {profile?.id} */}
              Public Key
              <IconButton>
                <FileCopyIcon fontSize="small" />
              </IconButton>
            </Typography>
          </div>
        </div>
        <div className="rightSide" style={{ display: 'flex', flexDirection: 'column' }}>
          <ShowIf condition={isGuest === true}>
            <Button color="primary" variant="contained" size="small" style={{ margin: 5 }}>
              Send Tip
            </Button>
            <Button color="secondary" variant="contained" size="small" style={{ margin: 5 }}>
              Add Friends
            </Button>
          </ShowIf>
        </div>
      </div>

      <div className={style.about}>
        <p>{profile?.bio}</p>
        {/* <EditableTextField
          name="profile.bio"
          value={profile?.bio || profileInfo}
          onChange={updateProfileBio}
          multiline={true}
          fullWidth={true}
        /> */}
      </div>

      <div className={style.socialMediaList}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank" style={{ color: 'white' }}>
            Link 1
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank" style={{ color: 'white' }}>
            Link 2
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank" style={{ color: 'white' }}>
            Link 3
          </a>
        </div>
      </div>
    </div>
  );
}
