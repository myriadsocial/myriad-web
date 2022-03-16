import {ChevronDownIcon, CurrencyDollarIcon, UserAddIcon, UserIcon} from '@heroicons/react/outline';
import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useSelector} from 'react-redux';

import {Grid} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {Metric} from '../Metric';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {useFriendOptions} from './hooks/use-friend-options.hook';
import {useStyles} from './profile-header.style';
import {Website} from './render/Website';

import {OfficialBadgeIcon} from 'src/components/atoms/Icons';
import {ReportComponent} from 'src/components/atoms/Report/Report.component';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
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
  const confirm = useConfirm();
  const {self, canAddFriend, isBlocked, isFriend, isRequested, isRequesting} = useFriendOptions(
    person,
    user,
    status,
  );
  const {openToasterSnack} = useToasterSnackHook();

  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElFriend, setAnchorElFriend] = React.useState<null | HTMLElement>(null);
  const [modalReportOpened, setModalReportOpened] = React.useState(false);

  const handleCloseMenu = () => {
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

  const handleOpenEdit = () => {
    if (onEdit) onEdit();
  };

  const handleLinkCopied = () => {
    handleCloseMenu();
    openToasterSnack({
      message: 'Profile link copied!',
      variant: 'success',
    });
  };

  const handleOpenReportModal = () => {
    setModalReportOpened(true);
  };

  const handleCloseReportModal = () => {
    setModalReportOpened(false);
  };

  const confirmBlockPerson = () => {
    handleCloseMenu();

    confirm({
      title: 'Block User?',
      description:
        "You won't be shown their posts in your timeline anymore and you might not be able to see their complete profile. Are you sure?",
      icon: 'danger',
      confirmationText: 'Block Now',
      onConfirm: () => {
        onBlock();
      },
    });
  };

  const handleSendRequest = () => {
    if (status) {
      onUnblockFriend(status);
    } else {
      onSendRequest();
    }
  };

  const confirmRemoveFriend = () => {
    handleCloseMenu();

    confirm({
      title: `Unfriend ${person.name}?`,
      description:
        "You won't be shown their posts in your timeline anymore and you might not be able to see their complete profile. Are you sure?",
      icon: 'danger',
      confirmationText: 'Unfriend Now',
      onConfirm: () => {
        onRemoveFriend();
      },
    });
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

        <Grid container alignItems="flex-start" justifyContent="space-between" wrap="nowrap">
          <Grid container alignItems="center">
            <Avatar
              alt={person.name}
              src={person.profilePictureURL}
              variant="circular"
              className={style.avatar}>
              {acronym(person.name)}
            </Avatar>
            <div>
              <Typography variant="body1" className={style.name} component="p">
                {person.name}
                <ShowIf condition={Boolean(person.verified)}>
                  <Tooltip
                    title={<Typography>Official Account</Typography>}
                    aria-label="official-account">
                    <IconButton
                      aria-label="official-badge"
                      style={{backgroundColor: 'transparent', paddingLeft: 4}}>
                      <OfficialBadgeIcon viewBox="0 0 24 24" color="primary" />
                    </IconButton>
                  </Tooltip>
                </ShowIf>
              </Typography>
              <Typography variant="body1" component="p" className={style.username}>
                @{person.username || 'username'}
              </Typography>
            </div>
          </Grid>
          <ShowIf condition={!self && !!user}>
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
              onClose={handleCloseMenu}>
              <CopyToClipboard text={linkUrl} onCopy={handleLinkCopied}>
                <MenuItem>Copy link profile</MenuItem>
              </CopyToClipboard>
              <ShowIf condition={person.username !== 'myriad_official'}>
                <MenuItem onClick={handleOpenReportModal} className={style.delete}>
                  Report account
                </MenuItem>
              </ShowIf>
              <ShowIf condition={!isBlocked}>
                <MenuItem
                  disabled={isBlocked}
                  onClick={confirmBlockPerson}
                  className={style.delete}>
                  Block this person
                </MenuItem>
              </ShowIf>
            </Menu>
          </ShowIf>
        </Grid>

        <Typography variant="body1" className={style.bio}>
          {person.bio}
        </Typography>

        <Website url={person.websiteURL} joinDate={person.createdAt} />

        <Grid container alignItems="flex-end" justifyContent="space-between" className={style.mt15}>
          <Metric data={person.metric} official={person.username === 'myriad_official'} profile />

          <div>
            <ShowIf condition={self && !!user}>
              <Button
                onClick={handleOpenEdit}
                classes={{root: style.button}}
                variant="contained"
                color="primary"
                size="small">
                Edit Profile
              </Button>
            </ShowIf>

            <ShowIf condition={!self && !!user}>
              <ShowIf condition={canAddFriend && person.username !== 'myriad_official'}>
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

              <ShowIf
                condition={
                  !isBlocked && !canAddFriend && person.username !== 'myriad_official' && !!user
                }>
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
                  onClose={handleCloseMenu}>
                  <ShowIf condition={isFriend}>
                    <MenuItem onClick={() => confirmRemoveFriend()}>Unfriend</MenuItem>
                  </ShowIf>
                  <ShowIf condition={isFriend}>
                    <MenuItem onClick={confirmBlockPerson} className={style.delete}>
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
        </Grid>
      </div>

      <ReportComponent
        onSubmit={onSubmitReport}
        user={person}
        open={modalReportOpened}
        onClose={handleCloseReportModal}
      />
    </div>
  );
};
