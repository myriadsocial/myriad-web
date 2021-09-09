import React from 'react';
import ReactPlayer from 'react-player';

import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {},
  }),
);

type VideoProps = {
  url: string;
};

export const Video: React.FC<VideoProps> = ({url}) => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <ReactPlayer url={url} controls={true} />
    </div>
  );
};
