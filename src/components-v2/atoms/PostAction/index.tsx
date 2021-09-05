import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import ForwardIcon from '@material-ui/icons/Forward';

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    flex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    flexColumn: {
      flexDirection: 'column',
    },
    action: {
      padding: 0,
    },
  }),
);

type Props = {};

export const PostActionComponent: React.FC<Props> = () => {
  const styles = useStyles();
  const [share] = useState(99);
  const [comment] = useState(99);
  return (
    <div className={styles.root}>
      <div>
        <IconButton className={styles.action}></IconButton>
        <Typography component="span">{comment} Comments</Typography>
      </div>
      <div>
        <IconButton className={styles.action}></IconButton>
        <Typography component="span">{share} Shares</Typography>
      </div>
    </div>
  );
};
