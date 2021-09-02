import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import ForwardIcon from '@material-ui/icons/Forward';

import {VoteProps} from './voting.interface';

import {debounce} from 'lodash';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'inline-block',
    },
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
      transform: 'rotate(-90deg)',
    },
    action2: {
      padding: 0,
      transform: 'rotate(90deg)',
    },
  }),
);

export const VotingComponent: React.FC<VoteProps> = ({variant = 'type1'}) => {
  const styles = useStyles();
  const [voting, setVoting] = useState<number>(0);

  const mode = () => (variant == 'type2' ? '' : styles.flexColumn);

  const handleUpVote = debounce(() => {
    setVoting(voting + 1);
  }, 500);

  const handleDownVote = debounce(() => {
    // open debate section -> down
    setVoting(voting - 1);
  }, 500);

  return (
    <div className={styles.root}>
      <div className={`${styles.flex} ${mode()}`}>
        <IconButton onClick={handleUpVote} color="primary" size="medium" className={styles.action}>
          <ForwardIcon fontSize="large" color="primary" />
        </IconButton>
        <Typography variant="h6" component="span">
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
