import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      fontSize: 14
    }
  })
);

type PostActionProps = {
  onClick: () => void;
};

export const PostAction: React.FC<PostActionProps> = ({ onClick }) => {
  const styles = useStyles();

  return <div className={styles.root}>Post Action</div>;
};
