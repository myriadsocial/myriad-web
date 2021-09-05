import {ShareIcon} from '@heroicons/react/outline';
import {action} from '@storybook/addon-actions';

import React, {useState} from 'react';

import {Typography} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    section: {
      display: 'inline-block',
      marginLeft: '5px',
      marginRight: '5px',
    },
    action: {
      padding: 0,
    },
    text: {
      fontSize: '12px',
    },
  }),
);

type Props = {};

export const PostActionComponent: React.FC<Props> = () => {
  const styles = useStyles();
  const [share] = useState(98);
  const [comment] = useState(840);
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <IconButton onClick={action('comment')} className={styles.action} color="primary">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography className={styles.text} component="span" color="textPrimary">
          {comment} Comments
        </Typography>
      </div>
      <div className={styles.section}>
        <IconButton onClick={action('share')} className={styles.action} color="primary">
          <SvgIcon component={ShareIcon} viewBox="0 0 24 24" />
        </IconButton>
        <Typography className={styles.text} component="span" color="textPrimary">
          {share} Shares
        </Typography>
      </div>
    </div>
  );
};
