import {CalendarIcon} from '@heroicons/react/outline';
import {GlobeAltIcon} from '@heroicons/react/outline';
import {CurrencyDollarIcon} from '@heroicons/react/solid';
import {DotsVerticalIcon} from '@heroicons/react/solid';
import {UserAddIcon} from '@heroicons/react/solid';

import React from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import SvgIcon from '@material-ui/core/SvgIcon';

import {User} from '../../../interfaces/user';
import {useStyles} from './profile-header.style';

export type Props = {
  user: User;
};

export const ProfileHeaderComponent: React.FC<Props> = props => {
  const {user} = props;
  const style = useStyles();
  return (
    <div>
      <div className={style.root}>
        <CardMedia className={style.media} image={user.bannerImageUrl} title={user.name} />
        <div className={style.flex}>
          <div className={style.flexCenter}>
            <Avatar
              alt={user.name}
              src={user.profilePictureURL}
              variant="circle"
              className={style.avatar}
            />
            <div>
              <Typography className={style.name} component="p">
                {user.name}
              </Typography>
              <Typography className={style.username} component="p">
                @{'username'}
              </Typography>
            </div>
          </div>
          <IconButton classes={{root: style.action}} aria-label="profile-setting">
            <SvgIcon component={DotsVerticalIcon} viewBox="0 0 20 20" />
          </IconButton>
        </div>
        <Typography className={`${style.username} ${style.mt22}`} component="p">
          {user.bio}
        </Typography>
        <Typography
          className={`${style.aditionLite} ${style.flexCenter} ${style.mt22}`}
          component="p">
          <SvgIcon
            classes={{root: style.fill}}
            className={`${style.icon}`}
            component={GlobeAltIcon}
            viewBox="0 0 24 24"
          />
          {'oct.network'}
          <SvgIcon
            classes={{root: style.fill}}
            className={`${style.icon} ${style.ml20}`}
            component={CalendarIcon}
            viewBox="0 0 24 24"
          />
          {'18 July 2021'}
        </Typography>
        <div className={`${style.mt15} ${style.flexEnd}`}>
          <div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Post
              </Typography>
              <Typography className={style.total} component="p">
                13k
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Kudos
              </Typography>
              <Typography className={style.total} component="p">
                103k
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Friends
              </Typography>
              <Typography className={style.total} component="p">
                96
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Experience
              </Typography>
              <Typography className={style.total} component="p">
                18
              </Typography>
            </div>
          </div>
          <div>
            <Button
              startIcon={<SvgIcon component={UserAddIcon} viewBox="0 0 20 20" />}
              classes={{root: style.button}}
              className={style.mr12}
              variant="contained"
              color="primary"
              size="small">
              Add Friend
            </Button>
            <Button
              startIcon={<SvgIcon component={CurrencyDollarIcon} viewBox="0 0 20 20" />}
              classes={{root: style.button}}
              variant="contained"
              color="primary"
              size="small">
              Send Tip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
