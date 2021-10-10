import {
  CalendarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  UserAddIcon,
  UserIcon,
} from '@heroicons/react/outline';
import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import SvgIcon from '@material-ui/core/SvgIcon';

import {Friend, FriendStatus} from '../../../interfaces/friend';
import {User} from '../../../interfaces/user';
import {useStyles} from './profile-header.style';

import {format} from 'date-fns';
import millify from 'millify';
import ShowIf from 'src/components/common/show-if.component';

export type Props = {
  user: User;
  selfProfile: boolean;
  status: Friend | null;
  totalFriends: number;
  totalExperience: number;
  onSendRequest: () => void;
  onDeclineRequest: () => void;
  onSendTip: () => void;
  onEdit?: () => void;
};

export const ProfileHeaderComponent: React.FC<Props> = props => {
  const {
    user,
    selfProfile,
    status,
    totalFriends,
    totalExperience,
    onEdit,
    onSendRequest,
    onSendTip,
  } = props;
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

  const handleOpenEdit = () => {
    if (onEdit) onEdit();
  };

  return (
    <div>
      <div className={style.root}>
        <CardMedia className={style.media} image={user.bannerImageUrl} title={user.name} />
        <div className={style.screen} />

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
                {formatNumber(totalFriends)}
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Experience
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(totalExperience)}
              </Typography>
            </div>
          </div>
          <div>
            <ShowIf condition={selfProfile}>
              <Button
                onClick={handleOpenEdit}
                classes={{root: style.button}}
                variant="contained"
                color="primary"
                size="small">
                Edit Profile
              </Button>
            </ShowIf>

            <ShowIf condition={!selfProfile}>
              <ShowIf condition={!status}>
                <Button
                  onClick={onSendRequest}
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
              </ShowIf>

              <ShowIf condition={Boolean(status)}>
                <Button
                  startIcon={
                    <SvgIcon
                      classes={{root: style.fill}}
                      component={status?.status === FriendStatus.APPROVED ? UserIcon : UserAddIcon}
                      viewBox="0 0 22 22"
                    />
                  }
                  classes={{root: style.button}}
                  className={style.mr12}
                  variant="contained"
                  color={status?.status === FriendStatus.APPROVED ? 'primary' : 'default'}
                  size="small">
                  <ShowIf condition={status?.status === FriendStatus.APPROVED}>Friend</ShowIf>
                  <ShowIf condition={status?.status === FriendStatus.PENDING}>Requested</ShowIf>
                </Button>
              </ShowIf>

              <Button
                onClick={onSendTip}
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
            </ShowIf>
          </div>
        </div>
      </div>
    </div>
  );
};
