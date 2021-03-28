import React from 'react';
import ReactPlayer from 'react-player';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper
    },
    gridList: {}
  })
);

type Props = {
  url: string;
};

export default function ImageListComponent({ url }: Props) {
  const style = useStyles();

  return (
    <div className={style.root}>
      <ReactPlayer url={url} />
    </div>
  );
}
