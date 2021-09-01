import React from 'react';

import {Typography} from '@material-ui/core';
import Avatar, {AvatarProps} from '@material-ui/core/Avatar';
import ListItem, {ListItemProps} from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

type ListItemComponentProps = ListItemProps & {
  icon?: React.ReactNode;
  avatar?: string;
  avatarVariant?: AvatarProps['variant'];
  title: string;
  subtitle?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
);

export const ListItemComponent: React.FC<ListItemComponentProps> = props => {
  const {icon, avatar, avatarVariant = 'circle', title, subtitle} = props;
  const styles = useStyles();

  return (
    <ListItem component="div">
      {avatar && (
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={avatar} variant={avatarVariant} />
        </ListItemAvatar>
      )}

      {icon && !avatar && <ListItemIcon>{icon}</ListItemIcon>}

      <ListItemText
        primary={title}
        secondary={
          subtitle ? (
            <Typography component="span" variant="body2" color="textPrimary">
              {subtitle}
            </Typography>
          ) : undefined
        }
      />
    </ListItem>
  );
};
