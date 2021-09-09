import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import ForwardIcon from '@material-ui/icons/Forward';

import {VoteProps} from './voting.interface';
import {useStyles} from './voting.style';

import {debounce} from 'lodash';

export const VotingComponent: React.FC<VoteProps> = ({variant = 'row'}) => {
  const styles = useStyles({variant});
  const [voting, setVoting] = useState<number>(0);

  const handleUpVote = debounce(() => {
    setVoting(voting + 1);
  }, 500);

  const handleDownVote = debounce(() => {
    // open debate section -> down
    setVoting(voting - 1);
  }, 500);

  return (
    <div className={styles.root}>
      <div className={styles.icon}>
        <IconButton
          onClick={handleUpVote}
          color="primary"
          className={styles.action}
          style={{transform: 'rotate(-90deg)'}}>
          <ForwardIcon fontSize="large" color="primary" />
        </IconButton>
        <Typography variant="caption" component="span">
          {voting}
        </Typography>
        <IconButton
          onClick={handleDownVote}
          color="primary"
          className={styles.action}
          style={{transform: 'rotate(90deg)'}}>
          <ForwardIcon fontSize="large" color="disabled" />
        </IconButton>
      </div>
    </div>
  );
};
