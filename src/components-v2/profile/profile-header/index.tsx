import {CalendarIcon} from '@heroicons/react/outline';
import {GlobeAltIcon} from '@heroicons/react/outline';
import {CurrencyDollarIcon} from '@heroicons/react/outline';
import {UserAddIcon} from '@heroicons/react/outline';
import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import SvgIcon from '@material-ui/core/SvgIcon';

import {User} from '../../../interfaces/user';
import {useStyles} from './profile-header.style';

import {format} from 'date-fns';
import millify from 'millify';
import {Friend} from 'src/interfaces/friend';

export type Props = {
  user: User;
  selfProfile: boolean;
  status: Friend | null;
};

export const ProfileHeaderComponent: React.FC<Props> = props => {
  const {user, selfProfile, status} = props;
  const style = useStyles();

  const formatNumber = (num: number) => {
    const vote = millify(num, {
      precision: 1,
      lowercase: true,
    });
    return vote;
  };

  const formatDate = (date: Date) => {
    const newFormat = format(new Date(date), 'd MMMM y');
    return newFormat;
  };

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
                @{user.username || 'username'}
              </Typography>
            </div>
          </div>
          {!selfProfile && (
            <IconButton classes={{root: style.action}} aria-label="profile-setting">
              <SvgIcon component={DotsVerticalIcon} viewBox="0 0 20 20" />
            </IconButton>
          )}
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
          {user.websiteURL || 'oct.network'}
          <SvgIcon
            classes={{root: style.fill}}
            className={`${style.icon} ${style.ml20}`}
            component={CalendarIcon}
            viewBox="0 0 24 24"
          />
          {formatDate(user.createdAt)}
        </Typography>
        <div className={`${style.mt15} ${style.flexEnd}`}>
          <div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Post
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(13000)}
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Kudos
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(103000)}
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Friends
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(96)}
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Experience
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(18)}
              </Typography>
            </div>
          </div>
          <div>
            {selfProfile && (
              <Button
                classes={{root: style.button}}
                className={style.mr12}
                variant="contained"
                color="primary"
                size="small">
                Edit Profile
              </Button>
            )}
            {!selfProfile && (
              <>
                {!status && (
                  <Button
                    startIcon={
                      <SvgIcon
                        classes={{root: style.fill}}
                        component={UserAddIcon}
                        viewBox="0 0 22 22"
                      />
                    }
                    classes={{root: style.button}}
                    className={style.mr12}
                    variant="contained"
                    color="primary"
                    size="small">
                    Add Friend
                  </Button>
                )}
                <Button
                  startIcon={
                    <SvgIcon
                      classes={{root: style.fill}}
                      component={CurrencyDollarIcon}
                      viewBox="2 2 21 21"
                    />
                  }
                  classes={{root: style.button}}
                  variant="contained"
                  color="primary"
                  size="small">
                  Send Tip
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
