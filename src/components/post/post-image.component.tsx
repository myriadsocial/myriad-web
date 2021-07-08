import React, { useState } from 'react';
import Carousel, { CarouselStyles } from 'react-images';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import NoSsr from '@material-ui/core/NoSsr';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';

import { useImageHooks } from './post-image.hook';

import { ImageData } from 'src/interfaces/post';
import theme from 'src/themes/light';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 640,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper
    },
    gridList: {},
    transparentHeader: {
      '& .MuiDialogTitle-root': {
        background: theme.palette.background.default
      }
    },
    tileTitle: {
      height: 200,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 700
    }
  })
);

const carouselStyle: CarouselStyles = {
  navigationNext: base => {
    return { ...base, background: theme.palette.primary.main };
  },
  navigationPrev: base => {
    return { ...base, background: theme.palette.primary.main };
  }
};

type Props = {
  images: ImageData[];
};

export default function ImageListComponent({ images }: Props) {
  const style = useStyles();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const { buildList } = useImageHooks();
  const [index, setIndex] = useState(0);

  const list = buildList(images.map(i => i.src));

  const openLightbox = (i: number) => {
    setIndex(i);
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setViewerIsOpen(false);
  };

  return (
    <div className={style.root}>
      <NoSsr>
        <GridList cellHeight={list.cellHeight} cols={list.cols}>
          {list.images.slice(0, 4).map((image, i) => (
            <GridListTile key={image.src} cols={image.cols} rows={image.rows} onClick={() => openLightbox(i)}>
              <img src={image.src} />
              {images.length > 4 && i === 3 && (
                <GridListTileBar
                  title={`+ ${list.images.length - 4} more`}
                  titlePosition="top"
                  actionPosition="left"
                  className={style.tileTitle}
                />
              )}
            </GridListTile>
          ))}
        </GridList>

        <Dialog open={viewerIsOpen} fullScreen={fullScreen} className={style.transparentHeader}>
          <MuiDialogTitle>
            <IconButton color="primary" aria-label="close" size="small" onClick={closeLightbox}>
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>

          <Carousel styles={carouselStyle} currentIndex={index} views={images.map((image, i) => ({ source: image.src, key: i }))} />
        </Dialog>
      </NoSsr>
    </div>
  );
}
