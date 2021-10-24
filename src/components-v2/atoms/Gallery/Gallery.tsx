import {XIcon, ChevronRightIcon, ChevronLeftIcon} from '@heroicons/react/solid';

import React, {useState} from 'react';
import Carousel from 'react-material-ui-carousel';

import {Dialog, IconButton, SvgIcon, Paper} from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import {useStyles} from './Gallery.styles';
import {GalleryType} from './Gallery.types';
import {buildList} from './util';

import theme from 'src/themes/light-theme-v2';

type GalleryProps = {
  images: string[];
  variant?: GalleryType;
  cloudName: string;
};

export const Gallery: React.FC<GalleryProps> = props => {
  const {images, cloudName, variant = 'horizontal'} = props;

  const style = useStyles();

  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const list = buildList(images, variant, cloudName);

  const handleImageClick = (index: number) => () => {
    openLightbox(index);
  };

  const openLightbox = (i: number) => {
    setIndex(i);
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setViewerIsOpen(false);
  };

  return (
    <div className={style.root}>
      <GridList cellHeight={list.cellHeight} cols={list.cols} className={style.imageGrid}>
        {list.images.slice(0, 4).map((image, i) => (
          <GridListTile key={image.sizes.thumbnail} cols={image.cols} rows={image.rows}>
            <img
              className={style.imageGrid}
              src={image.rows === 2 || list.cols === 1 ? image.sizes.medium : image.sizes.small}
              alt={image.src}
              onClick={handleImageClick(i)}
            />
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

      <Dialog open={viewerIsOpen} fullScreen>
        <IconButton
          color="primary"
          aria-label="close"
          size="small"
          onClick={closeLightbox}
          className={style.close}>
          <SvgIcon component={XIcon} />
        </IconButton>

        <Carousel
          index={index}
          autoPlay={false}
          NextIcon={
            <SvgIcon component={ChevronRightIcon} viewBox="0 0 20 20" className={style.icon} />
          }
          PrevIcon={
            <SvgIcon component={ChevronLeftIcon} viewBox="0 0 20 20" className={style.icon} />
          }
          navButtonsProps={{
            style: {
              backgroundColor: theme.palette.primary.main,
              color: '#FFF',
            },
          }}>
          {list.images.map((image, i) => (
            <Paper key={i} className={style.preview}>
              <img src={image.sizes.large} alt="" />
            </Paper>
          ))}
        </Carousel>
      </Dialog>
    </div>
  );
};
