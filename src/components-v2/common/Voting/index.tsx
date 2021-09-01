import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ForwardIcon from '@material-ui/icons/Forward';

type Voting = {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    flex: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    action: {
      padding: 0,
      transform: 'rotate(-90deg)',
    },
    action2: {
      padding: 0,
      transform: 'rotate(90deg)',
    },
  }),
);

export const VotingComponent: React.FC<Voting> = () => {
  const styles = useStyles();
  const [voting, setVoting] = useState<number>(0);

  const handleUpVote = () => {
    setVoting(voting + 1);
  };

  const handleDownVote = () => {
    setVoting(voting - 1);
  };

  return (
    <div className={styles.root}>
      <div className={styles.flex}>
        <IconButton onClick={handleUpVote} color="primary" size="medium" className={styles.action}>
          <ForwardIcon fontSize="large" color="primary" />
        </IconButton>
        <Typography variant="h5" component="span">
          {voting}
        </Typography>
        <IconButton
          onClick={handleDownVote}
          color="primary"
          size="medium"
          className={styles.action2}>
          <ForwardIcon fontSize="large" color="disabled" />
        </IconButton>
      </div>
    </div>
  );
};
