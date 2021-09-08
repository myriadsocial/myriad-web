import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import ForwardIcon from '@material-ui/icons/Forward';

import {VoteProps} from './voting.interface';
import {useStyles} from './voting.style';

import {debounce} from 'lodash';

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
          <ForwardIcon fontSize="medium" color="primary" />
        </IconButton>
        <Typography className={styles.text} component="span">
          {voting}
        </Typography>
        <IconButton
          onClick={handleDownVote}
          color="primary"
          size="medium"
          className={styles.action2}>
          <ForwardIcon fontSize="medium" color="disabled" />
        </IconButton>
      </div>
    </div>
  );
};
