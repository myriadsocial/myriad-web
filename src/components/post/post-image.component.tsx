import React, {useState} from 'react';
import Carousel, {CarouselStyles} from 'react-images';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import NoSsr from '@material-ui/core/NoSsr';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';

import {useImageHooks} from './post-image.hook';

import {PostOrigin} from 'src/interfaces/timeline';
import theme from 'src/themes/light';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 640,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {},
    transparentHeader: {
      '& .MuiDialogTitle-root': {
        background: theme.palette.background.default,
      },
    },
    tileTitle: {
      height: 200,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 700,
    },
    imageGrid: {
      height: 'auto !important',
    },
  }),
);

const carouselStyle: CarouselStyles = {
  navigationNext: base => {
    return {...base, background: theme.palette.primary.main};
  },
  navigationPrev: base => {
    return {...base, background: theme.palette.primary.main};
  },
};

type Props = {
  images: string[];
  platform: PostOrigin;
};

export default function ImageListComponent({images, platform}: Props) {
  const style = useStyles();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const {buildList} = useImageHooks();
  const [index, setIndex] = useState(0);

  const list = buildList(images, platform);

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
        <ImageList cellHeight={list.cellHeight} cols={list.cols} className={style.imageGrid}>
          {list.images.slice(0, 4).map((image, i) => (
            <ImageListItem
              key={image.sizes.thumbnail}
              cols={image.cols}
              rows={image.rows}
              onClick={() => openLightbox(i)}>
              <img
                className={style.imageGrid}
                src={image.rows === 2 || list.cols === 1 ? image.sizes.medium : image.sizes.small}
                alt={image.src}
              />
              {images.length > 4 && i === 3 && (
                <ImageListItemBar
                  title={`+ ${list.images.length - 4} more`}
                  titlePosition="top"
                  actionPosition="left"
                  className={style.tileTitle}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>

        <Dialog open={viewerIsOpen} fullScreen={fullScreen} className={style.transparentHeader}>
          <MuiDialogTitle>
            <IconButton color="primary" aria-label="close" size="small" onClick={closeLightbox}>
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>

          <Carousel
            styles={carouselStyle}
            currentIndex={index}
            views={list.images.map((image, i) => ({source: image.sizes.large, key: i}))}
          />
        </Dialog>
      </NoSsr>
    </div>
  );
}
