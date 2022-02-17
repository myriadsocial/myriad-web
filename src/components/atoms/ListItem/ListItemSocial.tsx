import React from 'react';

import {Typography} from '@material-ui/core';
import ListItem, {ListItemProps} from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import {createStyles, makeStyles, Theme, alpha} from '@material-ui/core/styles';

import {Avatar, AvatarSize} from '../Avatar';

import {SocialMedia} from 'src/interfaces/social';

type ListItemSocialComponentProps = ListItemProps & {
  account: SocialMedia;
  selectedPeople: string | null;
  title: string;
  avatar?: string;
  subtitle?: string | React.ReactNode;
  action?: string | React.ReactNode;
  active?: boolean;
  handleChange: (account: SocialMedia) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingRight: 30,
      paddingLeft: 30,
      padding: theme.spacing(1.25),
      '& .MuiListItemText-root': {
        padding: 0,

        '& .MuiListItem-root': {
          padding: 0,
        },
      },
      '&:hover': {
        backgroundColor: alpha('#FFC857', 0.15),

        '& #remove-item': {
          display: 'block',
        },
      },
    },
    avatar: {
      minWidth: 36,
      marginRight: 20,
    },
    itemIcon: {
      minWidth: 42,

      '& .MuiSvgIcon-root': {
        fill: 'currentColor',
      },
    },
    icon: {
      minWidth: 24,
      marginRight: 20,
      padding: 6,
    },
    active: {
      background: theme.palette.secondary.main,
      borderRadius: 6,
    },
    tiny: {
      width: 12,
      height: 12,
    },
    small: {
      width: theme.spacing(3.75),
      height: theme.spacing(3.75),
      fontSize: theme.spacing(2),
    },
    medium: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    large: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
    action: {
      display: 'none',
    },
  }),
);

export const ListItemSocialComponent: React.FC<ListItemSocialComponentProps> = props => {
  const {account, selectedPeople, title, subtitle, avatar, action, active, handleChange} = props;
  const styles = useStyles();

  const iconStyles = [styles.icon];
  const listProps: any = {};

  if (active) {
    iconStyles.push(styles.active);
  }

  return (
    <ListItem
      component="div"
      ContainerComponent="div"
      className={styles.root}
      role={undefined}
      disableGutters
      selected={selectedPeople === account.peopleId}
      {...listProps}>
      <ListItemIcon className={styles.itemIcon}>
        <Radio
          edge="start"
          color="primary"
          tabIndex={-1}
          checked={selectedPeople === account.peopleId || account.primary}
          value={account.peopleId}
          disableRipple
          onChange={() => handleChange(account)}
          inputProps={{'aria-labelledby': `checkbox-list-lable-${account.peopleId}`}}
        />
      </ListItemIcon>

      <ListItemAvatar className={styles.avatar}>
        <Avatar name={title} src={avatar} size={AvatarSize.LARGE} />
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography component="div" variant="h5" color="textPrimary">
            {title}
          </Typography>
        }
        secondary={
          subtitle ? (
            <Typography component="span" variant="subtitle1" color="textPrimary">
              {subtitle}
            </Typography>
          ) : undefined
        }
      />

      {action && (
        <div id="remove-item" className={styles.action}>
          {action}
        </div>
      )}
    </ListItem>
  );
};
