import React from 'react';

import {signOut} from 'next-auth/client';

import {ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';
import {useTheme} from '@material-ui/core/styles';

import {useStyles, ProfileHeaderProps} from '.';
import BellIconDefault from '../../images/Icons/notif-default.svg';
import VectorDownIcon from '../../images/Icons/vectorDownIcon.svg';
import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';
import {BoxComponent} from '../atoms/Box';

const ProfileHeader = ({name, username, avatar}: ProfileHeaderProps): JSX.Element => {
  const theme = useTheme();
  const classes = useStyles();

  //CONSTANTS
  const BORDER_RADIUS = theme.spacing(0, 0, 2.5, 2.5);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    signOut({
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
      redirect: true,
    });
  };
  return (
    <div className={classes.root}>
      <div className={classes.vectorDownIconWrapper}>
        <IconButton
          ref={anchorRef}
          centerRipple
          disableRipple
          className={classes.downIconButton}
          onClick={openMenu}>
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

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          style={{zIndex: 2}}>
          {({TransitionProps, placement}) => (
            <Grow
              {...TransitionProps}
              style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
              <Paper
                style={{
                  width: 311,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                }}>
                <ClickAwayListener onClickAway={closeMenu}>
                  <MenuList>
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>Switch Account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </BoxComponent>
    </div>
  );
};

export default ProfileHeader;
