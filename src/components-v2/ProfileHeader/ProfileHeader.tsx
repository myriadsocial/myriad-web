import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';

import {useStyles, ProfileHeaderProps} from '.';
import BellIconDefault from '../../images/Icons/notif-default.svg';
import VectorDownIcon from '../../images/Icons/vectorDownIcon.svg';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';
import {BoxComponent} from '../atoms/Box';

const ProfileHeader = ({
  name = 'Aaron Ting',
  username = '@aaronting8',
  avatar = 'https://res.cloudinary.com/dsget80gs/icon/Ellipse_445aaron.svg',
}: ProfileHeaderProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles();

  //CONSTANTS
  const BORDER_RADIUS = theme.spacing(0, 0, 2.5, 2.5);

  const handleMenuProfileHeader = () => {
    console.log('opening menu!');
  };

  return (
    <div className={classes.root}>
      <div className={classes.vectorDownIconWrapper}>
        <IconButton
          centerRipple
          disableRipple
          className={classes.downIconButton}
          onClick={handleMenuProfileHeader}>
          <SvgIcon className={classes.downSvgIcon} component={VectorDownIcon} viewBox="0 0 10 7" />
        </IconButton>
      </div>
      <BoxComponent radiusStr={BORDER_RADIUS}>
        <div className={classes.secondRoot}>
          <div className={classes.iconButtonWrapper}>
            <IconButton aria-label="avatar">
              <SvgIcon component={BellIconDefault} viewBox="0 0 24 24" />
            </IconButton>
          </div>
          <div>
            <Typography variant="h5">{name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {username}
            </Typography>
          </div>
          <div className={classes.customAvatarWrapper}>
            <CustomAvatar avatar={avatar} size={CustomAvatarSize.MEDIUM} />
          </div>
        </div>
      </BoxComponent>
    </div>
  );
};

export default ProfileHeader;
