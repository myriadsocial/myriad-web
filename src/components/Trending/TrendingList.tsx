import React from 'react';

import Link from 'next/link';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './trending-list.styles';

import {Tag} from 'src/interfaces/experience';
import {v4 as uuid} from 'uuid';

interface TrendingListProps {
  trendings: Tag[];
  add?: boolean;
  onAdd?: (tag: string) => void;
}

export const TrendingList: React.FC<TrendingListProps> = props => {
  const {trendings, add = false} = props;
  const style = useStyles();

  return (
    <div className={style.root}>
      <List className={style.list}>
        {trendings.map((trending, i) => (
          <ListItem className={style.item} key={uuid()}>
            <ListItemText disableTypography className={style.text}>
              <Link href={`/topic/hashtag?tag=${trending.id}`} shallow>
                <a href={`/topic/hashtag?tag=${trending.id}`}>
                  <Typography variant="body1" color="textPrimary">{`#${trending.id}`}</Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary">{`${trending.count} Posts`}</Typography>
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
