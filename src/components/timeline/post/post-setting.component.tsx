import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

type PostSettingProps = {
  postId: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      position: 'relative'
    }
  })
);

export const PostSettingComponent: React.FC<PostSettingProps> = ({ postId }) => {
  const styles = useStyles();

  return <div className={styles.root}></div>;
};
