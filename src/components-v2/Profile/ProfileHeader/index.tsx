import {
  CalendarIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  UserAddIcon,
  UserIcon,
} from '@heroicons/react/outline';
import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';

import {acronym} from '../../../helpers/string';
import {PromptComponent} from '../../atoms/Prompt/prompt.component';
import {ReportComponent} from '../../atoms/Report/Report.component';
import {useFriendOptions} from './hooks/use-friend-options.hook';
import {useStyles} from './profile-header.style';

import {format} from 'date-fns';
import millify from 'millify';
import {Status, Toaster} from 'src/components-v2/atoms/Toaster';
import ShowIf from 'src/components/common/show-if.component';
import {Friend} from 'src/interfaces/friend';
import {ReportProps} from 'src/interfaces/report';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

export type Props = {
  person: User;
  user?: User;
  status?: Friend;
  onSendRequest: () => void;
  onAcceptFriend: () => void;
  onUnblockFriend: (friend: Friend) => void;
  onDeclineRequest: () => void;
  onRemoveFriend: () => void;
  onSendTip: () => void;
  onEdit?: () => void;
  linkUrl: string;
  onSubmitReport: (payload: ReportProps) => void;
  onBlock: () => void;
};

const background = 'https://res.cloudinary.com/dsget80gs/background/profile-default-bg.png';

export const ProfileHeaderComponent: React.FC<Props> = props => {
  const {
    person,
    user,
    status,
    onEdit,
    onAcceptFriend,
    onSendRequest,
    onUnblockFriend,
    onDeclineRequest,
    onRemoveFriend,
    onSendTip,
    linkUrl,
    onSubmitReport,
    onBlock,
  } = props;
  const style = useStyles();

  const {self, canAddFriend, isBlocked, isFriend, isRequested, isRequesting} = useFriendOptions(
    person,
    user,
    status,
  );

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElFriend, setAnchorElFriend] = React.useState<null | HTMLElement>(null);
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openPrompt, setOpenPrompt] = React.useState(false);
  const [openRemoveFriend, setOpenRemoveFriend] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElFriend(null);
  };

  const handleClickUserOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClickFriendOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isFriend || isRequested) {
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

  const handleOpenPrompt = () => {
    setOpenPrompt(true);
    handleClose();
  };

  const handleClosePrompt = () => {
    setOpenPrompt(false);
  };

  const handleBlockUser = () => {
    onBlock();
    setOpenPrompt(false);
  };

  const handleSendRequest = () => {
    if (status) {
      onUnblockFriend(status);
    } else {
      onSendRequest();
    }
  };

  const handleURL = (url: string): string => {
    if (url.search('http') === -1) {
      return 'https://' + url;
    }
    return url;
  };

  const confirmRemoveFriend = () => {
    setOpenRemoveFriend(true);
  };

  const closeConfirmRemoveFriend = () => {
    setOpenRemoveFriend(false);
  };

  const handleRemoveFriend = () => {
    onRemoveFriend();

    closeConfirmRemoveFriend();
  };

  return (
    <div>
      <div className={style.root}>
        <CardMedia
          className={style.media}
          image={person.bannerImageUrl || background}
          title={person.name}
        />
        <div className={style.screen} />

        <div className={style.flex}>
          <div className={style.flexCenter}>
            <Avatar
              alt={person.name}
              src={person.profilePictureURL}
              variant="circle"
              className={style.avatar}>
              {acronym(person.name)}
            </Avatar>
            <div>
              <Typography className={style.name} component="p">
                {person.name}
              </Typography>
              <Typography className={style.username} component="p">
                @{person.username || 'username'}
              </Typography>
            </div>
          </div>

          <ShowIf condition={!self}>
            <IconButton
              onClick={handleClickUserOption}
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
          </ShowIf>
        </div>

        <Typography className={`${style.username} ${style.mt22}`} component="p">
          {person.bio}
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
          <Link
            className={style.link}
            href={handleURL(person.websiteURL ?? '')}
            rel="noreferrer"
            target="_blank">
            {person.websiteURL || 'oct.network'}
          </Link>
          <SvgIcon
            classes={{root: style.fill}}
            className={`${style.icon} ${style.ml20}`}
            component={CalendarIcon}
            viewBox="0 0 24 24"
          />
          {formatDate(person.createdAt)}
        </Typography>

        <div className={`${style.mt15} ${style.flexEnd}`}>
          <div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Post
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(person.metric?.totalPosts ?? 0)}
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Kudos
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(person.metric?.totalKudos ?? 0)}
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Friends
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(person.metric?.totalFriends ?? 0)}
              </Typography>
            </div>
            <div className={style.text}>
              <Typography className={`${style.username}`} component="p">
                Experience
              </Typography>
              <Typography className={style.total} component="p">
                {formatNumber(person.metric?.totalExperiences ?? 0)}
              </Typography>
            </div>
          </div>
          <div>
            <ShowIf condition={self}>
              <Button
                onClick={handleOpenEdit}
                classes={{root: style.button}}
                variant="contained"
                color="primary"
                size="small">
                Edit Profile
              </Button>
            </ShowIf>

            <ShowIf condition={!self}>
              <ShowIf condition={canAddFriend}>
                <Button
                  onClick={handleSendRequest}
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

              <ShowIf condition={!isBlocked}>
                <Button
                  onClick={handleClickFriendOption}
                  startIcon={
                    <SvgIcon
                      classes={{root: style.fill}}
                      component={isFriend ? UserIcon : UserAddIcon}
                      viewBox="0 0 22 22"
                    />
                  }
                  endIcon={isFriend || isRequested ? <SvgIcon component={ChevronDownIcon} /> : null}
                  classes={{root: style.button}}
                  className={style.mr12}
                  variant="contained"
                  color={isFriend ? 'primary' : 'default'}
                  size="small">
                  <ShowIf condition={isFriend}>Friends</ShowIf>
                  <ShowIf condition={isRequested}>Respond</ShowIf>
                  <ShowIf condition={isRequesting}>Requested</ShowIf>
                </Button>
                <Menu
                  classes={{paper: style.menu}}
                  anchorEl={anchorElFriend}
                  getContentAnchorEl={null}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                  transformOrigin={{vertical: 'top', horizontal: 'right'}}
                  open={Boolean(anchorElFriend)}
                  onClose={handleClose}>
                  <ShowIf condition={isFriend}>
                    <MenuItem onClick={() => confirmRemoveFriend()}>Unfriend</MenuItem>
                  </ShowIf>
                  <ShowIf condition={isFriend}>
                    <MenuItem onClick={handleOpenPrompt} className={style.delete}>
                      Block this person
                    </MenuItem>
                  </ShowIf>
                  <ShowIf condition={isRequested}>
                    <MenuItem onClick={() => onAcceptFriend()}>Accept</MenuItem>
                  </ShowIf>
                  <ShowIf condition={isRequested}>
                    <MenuItem onClick={() => onDeclineRequest()}>Reject</MenuItem>
                  </ShowIf>
                </Menu>
              </ShowIf>

              <ShowIf condition={!isBlocked}>
                <Button
                  disabled={balanceDetails.length === 0}
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
            </ShowIf>
          </div>
        </div>
      </div>

      <PromptComponent
        onCancel={handleClosePrompt}
        open={openPrompt}
        icon="danger"
        title="Block User?"
        subtitle="You will not able to search and see post from this user">
        <div className={`${style['flex-center']}`}>
          <Button
            onClick={handleClosePrompt}
            className={style.m1}
            size="small"
            variant="outlined"
            color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleBlockUser}
            className={style.error}
            size="small"
            variant="contained">
            Block Now
          </Button>
        </div>
      </PromptComponent>

      <PromptComponent
        onCancel={closeConfirmRemoveFriend}
        open={openRemoveFriend}
        icon="danger"
        title={`Unfriend ${person.name}?`}
        subtitle="You will not able to search and see post from this user">
        <div className={`${style['flex-center']}`}>
          <Button
            onClick={closeConfirmRemoveFriend}
            className={style.m1}
            size="small"
            variant="outlined"
            color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleRemoveFriend}
            className={style.error}
            size="small"
            variant="contained">
            Unfriend Now
          </Button>
        </div>
      </PromptComponent>

      <ReportComponent
        onSubmit={onSubmitReport}
        user={person}
        open={open}
        onClose={handleCloseModal}
      />

      <Toaster
        open={linkCopied}
        onClose={handleCloseLinkCopied}
        toasterStatus={Status.SUCCESS}
        message="Profile link copied!"
      />
    </div>
  );
};
