import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import ReactPlayer from 'react-player';

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
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ReactPlayer url={url} />
    </div>
  );
}
