import {
  CalendarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  UserAddIcon,
  UserIcon,
} from '@heroicons/react/outline';
import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';

import {Friend, FriendStatus} from '../../../interfaces/friend';
import {User, Report} from '../../../interfaces/user';
import {ReportComponent} from '../../atoms/Report/Report.component';
import {useStyles} from './profile-header.style';

import {format} from 'date-fns';
import millify from 'millify';
import {Status, Toaster} from 'src/components-v2/atoms/Toaster';
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
  linkUrl: string;
  onSubmit: (payload: Partial<Report>) => void;
};

const background = 'https://res.cloudinary.com/dsget80gs/background/profile-default-bg.png';

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
    linkUrl,
    onSubmit,
  } = props;
  const style = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElFriend, setAnchorElFriend] = React.useState<null | HTMLElement>(null);
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElFriend(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (status?.status === FriendStatus.APPROVED) {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
    }
  };

  const handleClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (status?.status === FriendStatus.APPROVED) {
      e.stopPropagation();
      setAnchorElFriend(e.currentTarget);
    }
  };

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

  const handleLinkCopied = () => {
    handleClose();
    setLinkCopied(true);
  };

  const handleCloseLinkCopied = () => {
    setLinkCopied(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
    handleClose();
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className={style.root}>
        <CardMedia
          className={style.media}
          image={user.bannerImageUrl || background}
          title={user.name}
        />
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
            <>
              <IconButton
                onClick={handleClick}
                classes={{root: style.action}}
                aria-label="profile-setting">
                <SvgIcon
                  classes={{root: style.solid}}
                  component={DotsVerticalIcon}
                  viewBox="0 0 20 20"
                />
              </IconButton>
              <Menu
                classes={{
                  paper: style.menu,
                }}
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem disabled>Message</MenuItem>
                <CopyToClipboard text={linkUrl} onCopy={handleLinkCopied}>
                  <MenuItem>Copy link profile</MenuItem>
                </CopyToClipboard>
                <MenuItem disabled>Mute account</MenuItem>
                <MenuItem onClick={handleOpenModal} className={style.delete}>
                  Report account
                </MenuItem>
              </Menu>
            </>
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
                  onClick={handleClickOption}
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
                <Menu
                  classes={{
                    paper: style.menu,
                  }}
                  anchorEl={anchorElFriend}
                  getContentAnchorEl={null}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                  transformOrigin={{vertical: 'top', horizontal: 'right'}}
                  open={Boolean(anchorElFriend)}
                  onClose={handleClose}>
                  <MenuItem>Unfriend</MenuItem>
                  <MenuItem disabled className={style.delete}>
                    Block this person
                  </MenuItem>
                </Menu>
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

      <ReportComponent onSubmit={onSubmit} user={user} open={open} onClose={handleCloseModal} />

      <Toaster
        open={linkCopied}
        onClose={handleCloseLinkCopied}
        toasterStatus={Status.SUCCESS}
        message="Profile link copied!"
      />
    </div>
  );
};
