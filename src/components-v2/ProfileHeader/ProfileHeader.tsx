import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import Link from 'next/link';

import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles, ProfileHeaderProps} from '.';
import BellIconDefault from '../../images/Icons/notif-default.svg';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';

const ProfileHeader: React.FC<ProfileHeaderProps> = props => {
  const {user, alias, handleSignOut} = props;
  const classes = useStyles();
  const [expanding, setExpanding] = useState(false);

  const handleMenuProfileHeader = () => {
    setExpanding(!expanding);
  };

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <div className={classes.secondRoot}>
          <div className={classes.iconButtonWrapper}>
            <IconButton aria-label="avatar">
              <SvgIcon component={BellIconDefault} viewBox="0 0 24 24" />
            </IconButton>
          </div>
          <div className={classes.textAlign}>
            <Typography variant="h5">{user.name || alias || ''}</Typography>
            <Typography variant="caption" color="textSecondary">
              {user.username || '@username'}
            </Typography>
          </div>
          <div className={classes.customAvatarWrapper}>
            <CustomAvatar avatar={user.profilePictureURL || ''} size={CustomAvatarSize.MEDIUM} />
          </div>
        </div>
      </div>
      <div className={`${classes.content} ${expanding ? classes.open : classes.close}`}>
        <ListItem classes={{gutters: classes.gutters}} className={classes.hover}>
          <ListItemText className={classes.textAlign}>
            <Link href={`/profile/${user.id}`}>
              <Typography className={classes.text} component="span">
                View profile
              </Typography>
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem classes={{gutters: classes.gutters}} className={classes.hover}>
          <ListItemText className={classes.textAlign}>
            <Typography className={classes.text} component="span" onClick={console.log}>
              Switch account
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem classes={{gutters: classes.gutters}} className={classes.hover}>
          <ListItemText className={classes.textAlign}>
            <Typography className={classes.text} component="span" onClick={() => handleSignOut()}>
              Log out
            </Typography>
          </ListItemText>
        </ListItem>
      </div>
      <div
        className={classes.downIconButton}
        onClick={handleMenuProfileHeader}
        role="button"
        tabIndex={0}
        aria-hidden="true">
        <SvgIcon
          color="primary"
          component={expanding ? ChevronUpIcon : ChevronDownIcon}
          viewBox="0 0 24 24"
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
