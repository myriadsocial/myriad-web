import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { ImageData } from '../../interfaces';

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
  images: ImageData[];
};

export default function ImageListComponent({ images }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={3}>
        {images.map(image => (
          <GridListTile key={image.title} cols={image.cols || 1}>
            <img src={image.url} alt={image.title} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
