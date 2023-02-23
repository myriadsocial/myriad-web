import React from 'react';

import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  ListItem,
} from '@material-ui/core';
import { alpha, createStyles, makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: '100%',
      position: 'relative',
      '&:hover': {
        backgroundColor: alpha('#FFC857', 0.15),
        '& .MuiCardActionArea-focusHighlight': {
          opacity: 0,
        },
      },
    },
  }),
);

export const InstanceCardSkeleton = () => {
  const styles = useStyles();

  return (
    <React.Fragment>
      <ListItem>
        <Card className={styles.root} style={{ background: 'transparent' }}>
          <CardActionArea
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: '10px',
            }}>
            <CardMedia style={{ padding: 16 }}>
              <Skeleton height={80} width={80} variant="rect" />
            </CardMedia>
            <CardContent style={{ width: '100%' }}>
              <Skeleton height={80} width={368} variant="rect" />
            </CardContent>
          </CardActionArea>
        </Card>
      </ListItem>
      <ListItem>
        <Card>
          <CardActionArea
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: '10px',
            }}>
            <CardMedia style={{ padding: 16 }}>
              <Skeleton height={80} width={80} variant="rect" />
            </CardMedia>
            <CardContent style={{ width: '100%' }}>
              <Skeleton height={80} width={368} variant="rect" />
            </CardContent>
          </CardActionArea>
        </Card>
      </ListItem>
    </React.Fragment>
  );
};
