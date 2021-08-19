import React from 'react';

import Link from 'next/link';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

import {Tag} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import {v4 as uuid} from 'uuid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
    },
    list: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
    },
    item: {
      '& .MuiListItemText-primary': {
        fontWeight: 400,
        fontSize: 16,
        lineHeight: '19px',
      },

      '& .MuiTypography-colorTextSecondary': {
        color: theme.palette.primary.dark,
      },
    },
    avatar: {
      minWidth: 20,
    },
    text: {
      '& > a': {
        color: theme.palette.text.primary,
      },
    },
  }),
);

interface TopicListProps {
  topics: Tag[];
  add?: boolean;
  onAdd?: (tag: string) => void;
}

export const TopicListComponent: React.FC<TopicListProps> = ({topics, add = false}) => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <List className={style.list}>
        {topics.map((topic, i) => (
          <ListItem className={style.item} key={uuid()}>
            <ListItemAvatar className={style.avatar}>
              <Typography variant="caption">{i + 1}</Typography>
            </ListItemAvatar>
            <ListItemText disableTypography className={style.text}>
              <Link href={`?tag=${topic.id}&type=${TimelineType.ALL}`} shallow={true}>
                <a href={`?tag=${topic.id}&type=${TimelineType.ALL}`}>
                  <Typography variant="h4">{`#${topic.id}`}</Typography>
                  <Typography variant="caption">{`${topic.count} Posts`}</Typography>
                </a>
              </Link>
            </ListItemText>
            {add && (
              <ListItemSecondaryAction>
                <Button
                  onClick={() => console.log('add tag')}
                  aria-label="add-tag"
                  color="primary"
                  variant="contained"
                  size="medium">
                  Add Tag
                </Button>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};
