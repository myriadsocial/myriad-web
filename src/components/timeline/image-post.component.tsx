import React from 'react';
import Carousel from 'react-images';
import Galery from 'react-photo-gallery';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import NoSsr from '@material-ui/core/NoSsr';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';

import { ImageData } from '../../interfaces/post';

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [viewerIsOpen, setViewerIsOpen] = React.useState(false);

  const openLightbox = () => {
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setViewerIsOpen(false);
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <Galery photos={images} onClick={openLightbox} />

        <Dialog open={viewerIsOpen} fullScreen={fullScreen}>
          <MuiDialogTitle>
            <IconButton color="secondary" aria-label="close" size="small" onClick={closeLightbox}>
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>

          <Carousel views={images.map((image, i) => ({ source: image.src, key: i }))} />
        </Dialog>
      </NoSsr>
    </div>
  );
}
