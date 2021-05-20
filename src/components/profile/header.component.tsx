import React from 'react';

import { User } from 'next-auth';

import { Button } from '@material-ui/core';

import ShowIf from '../common/show-if.component';
import { useStyles } from './profile.style';

import { WithAdditionalParams } from 'next-auth/_utils';
import { ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: WithAdditionalParams<User>;
  profile: ExtendedUserPost | null;
  loading: Boolean;
  isGuest: Boolean;
};

export default function Header({ user, profile, loading, isGuest }: Props) {
  const style = useStyles();
  return (
    <div className="header" style={{ marginBottom: 10 }}>
      <div className={style.headerPicture}>
        <div className="leftSide" style={{ display: 'flex', alignItems: 'center' }}>
          <div className={style.avatar}>
            <span>😘</span>
          </div>
          <div className="Keterangan" style={{ width: 300, wordWrap: 'break-word' }}>
            <p className="username">{profile?.name}</p>
            <p className="publicKey">{profile?.id}</p>
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
      </div>

      <div className={style.socialMediaList}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank">
            Link 1
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank">
            Link 2
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
          <div className={style.logo}></div>
          <a href="#" target="_blank">
            Link 3
          </a>
        </div>
      </div>
    </div>
  );
}
