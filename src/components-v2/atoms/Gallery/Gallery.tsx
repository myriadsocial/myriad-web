import {XIcon, ChevronRightIcon, ChevronLeftIcon} from '@heroicons/react/solid';

import React, {useEffect, useState} from 'react';
import Carousel from 'react-material-ui-carousel';

import {Dialog, IconButton, SvgIcon, Paper} from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import {Skeleton} from '@material-ui/lab';

import {useStyles} from './Gallery.styles';
import {GalleryType, ImageListProps, ImageListItemProps} from './Gallery.types';
import {buildList} from './util';

import ImagePlaceholder from 'src/images/Icons/myriad-grey.svg';
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
  const [items, setItems] = useState<ImageListItemProps[]>([]);
  const [list, setList] = useState<ImageListProps>({
    cols: 0,
    cellHeight: 0,
    images: [],
  });

  useEffect(() => {
    const gallery = buildList(images, variant, cloudName);

    setList(gallery);
    setItems(gallery.images);
  }, []);

  const imageLoaded = (index: number) => () => {
    setItems(prevItems =>
      prevItems.map((image, i) => {
        if (i === index) {
          image.loading = false;
        }

        return image;
      }),
    );
  };

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
      <ImageList rowHeight={list.cellHeight} cols={list.cols} className={style.imageGrid}>
        {items.slice(0, 4).map((image, i) => (
          <ImageListItem
            key={image.sizes.thumbnail}
            cols={image.cols}
            rows={image.rows}
            onClick={handleImageClick(i)}>
            {image.loading && (
              <Skeleton
                variant="rect"
                animation={false}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                width={
                  image.cols === 1 || (image.cols === 2 && images.length === 2)
                    ? 635
                    : 635 / image.cols
                }
                height={list.cellHeight * image.rows}>
                <SvgIcon
                  component={ImagePlaceholder}
                  viewBox="0 0 50 50"
                  style={{width: 50, height: 50, visibility: 'visible'}}
                />
              </Skeleton>
            )}

            <img
              style={{visibility: image.loading ? 'hidden' : 'visible'}}
              className={style.imageGrid}
              src={image.rows === 2 || list.cols === 1 ? image.sizes.medium : image.sizes.small}
              alt={image.src}
              onLoad={imageLoaded(i)}
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
              <img src={image.sizes.large} alt="" style={{height: '100%'}} />
            </Paper>
          ))}
        </Carousel>
      </Dialog>
    </div>
  );
};
