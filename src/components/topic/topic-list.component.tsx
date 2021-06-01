import React from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block'
    },
    list: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2)
    },
    item: {
      '& .MuiListItemText-primary': {
        fontWeight: 400,
        fontSize: 16,
        lineHeight: '19px'
      }
    },
    avatar: {
      minWidth: 20
    }
  })
);

interface TopicListProps {
  add?: boolean;
  onAdd?: (tag: string) => void;
}

export const TopicListComponent: React.FC<TopicListProps> = ({ add = false, onAdd }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        <ListItem className={classes.item}>
          <ListItemAvatar className={classes.avatar}>
            <Typography variant="caption">1</Typography>
          </ListItemAvatar>
          <ListItemText primary="#BitcoinDropValue" secondary="500 Posts" />
          {add && (
            <ListItemSecondaryAction>
              <Button onClick={() => console.log('add tag')} aria-label="add-tag" color="primary" variant="contained" size="medium">
                Add Tag
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <ListItem className={classes.item}>
          <ListItemAvatar className={classes.avatar}>
            <Typography variant="caption">2</Typography>
          </ListItemAvatar>
          <ListItemText primary="#ATTAAURELL" secondary="450 Posts" />
          {add && (
            <ListItemSecondaryAction>
              <Button onClick={() => console.log('add tag')} aria-label="add-tag" color="primary" variant="contained" size="medium">
                Add Tag
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <ListItem className={classes.item}>
          <ListItemAvatar className={classes.avatar}>
            <Typography variant="caption">3</Typography>
          </ListItemAvatar>
          <ListItemText primary="#EllonMurz" secondary="200 Posts" />
          {add && (
            <ListItemSecondaryAction>
              <Button onClick={() => console.log('add tag')} aria-label="add-tag" color="primary" variant="contained" size="medium">
                Add Tag
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <ListItem className={classes.item}>
          <ListItemAvatar className={classes.avatar}>
            <Typography variant="caption">4</Typography>
          </ListItemAvatar>
          <ListItemText primary="#GoToMerger" secondary="200 Posts" />
          {add && (
            <ListItemSecondaryAction>
              <Button onClick={() => console.log('add tag')} aria-label="add-tag" color="primary" variant="contained" size="medium">
                Add Tag
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
        <ListItem className={classes.item}>
          <ListItemAvatar className={classes.avatar}>
            <Typography variant="caption">5</Typography>
          </ListItemAvatar>
          <ListItemText primary="#KeretacepatJKTBDG" secondary="200 Posts" />
          {add && (
            <ListItemSecondaryAction>
              <Button onClick={() => console.log('add tag')} aria-label="add-tag" color="primary" variant="contained" size="medium">
                Add Tag
              </Button>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </List>
    </div>
  );
};
