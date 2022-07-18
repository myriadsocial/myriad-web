import {XIcon, ChevronRightIcon, ChevronLeftIcon} from '@heroicons/react/solid';

import React, {useEffect, useState} from 'react';
import Carousel from 'react-material-ui-carousel';

import {Dialog, IconButton, SvgIcon, Paper, Grid, useTheme, useMediaQuery} from '@material-ui/core';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';

import {useStyles} from './Gallery.styles';
import {GalleryType, ImageListProps, ImageListItemProps} from './Gallery.types';
import {Skeleton} from './Image.skeleton';
import {buildList} from './util';

import ShowIf from 'src/components/common/show-if.component';

type GalleryProps = {
  images: string[];
  variant?: GalleryType;
};

export const Gallery: React.FC<GalleryProps> = props => {
  const {images, variant = 'horizontal'} = props;

  const style = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState<ImageListItemProps[]>([]);
  const [list, setList] = useState<ImageListProps>({
    cols: 0,
    cellHeight: 0,
    images: [],
  });

  useEffect(() => {
    const gallery = buildList(images, variant, isMobile);

    setList(gallery);
    setItems(gallery.images);
  }, [isMobile]);

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

  if (items.length === 0) return null;

  return (
    <div className={style.root}>
      <ShowIf condition={variant === 'horizontal'}>
        <ImageList rowHeight={list.cellHeight} cols={list.cols} className={style.imageGrid}>
          {items.slice(0, 4).map((image, i) => (
            <ImageListItem
              key={image.sizes.thumbnail}
              cols={image.cols}
              rows={image.rows}
              onClick={handleImageClick(i)}>
              {image.loading && (
                <Skeleton
                  width={
                    image.cols === 1 || (image.cols === 2 && images.length === 2)
                      ? 635
                      : 635 / image.cols
                  }
                  height={list.cellHeight * image.rows}
                />
              )}

              <img
                style={{visibility: image.loading ? 'hidden' : 'visible'}}
                className={style.imageGrid}
                src={image.rows === 2 || list.cols === 1 ? image.sizes.medium : image.sizes.small}
                alt={image.src}
                onLoad={imageLoaded(i)}
              />
              {images.length > 4 && i === 2 && (
                <ImageListItemBar
                  title={`+ ${list.images.length - 4} more`}
                  position="top"
                  actionPosition="left"
                  className={style.tileTitle}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      </ShowIf>

      <ShowIf condition={variant === 'vertical'}>
        <Grid container spacing={1}>
          <Grid item xs={items.length > 1 ? 6 : 12} onClick={handleImageClick(0)}>
            <img
              className={style.imageGrid}
              style={{
                height: list.cols * list.cellHeight + 14,
                objectFit: 'cover',
              }}
              src={items[0].rows === 2 ? items[0].sizes.medium : items[0].sizes.small}
              alt={items[0].src}
            />
          </Grid>

          <ShowIf condition={items.length > 1}>
            <Grid item xs={6} container spacing={1}>
              {items.slice(1, 3).map((image, i) => (
                <Grid
                  item
                  xs={12}
                  key={i}
                  style={{position: 'relative'}}
                  onClick={handleImageClick(i + 1)}>
                  <img
                    className={style.imageGrid}
                    style={{
                      height: items.length > 2 ? list.cellHeight : list.cols * list.cellHeight + 14,
                      width: '100%',
                      objectFit: 'cover',
                    }}
                    src={image.rows === 2 ? image.sizes.medium : image.sizes.small}
                    alt={image.src}
                  />

                  {images.length > 3 && i === 1 && (
                    <ImageListItemBar
                      title={`+ ${list.images.length - 3} more`}
                      position="top"
                      actionPosition="left"
                      className={style.tileTitleVertical}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </ShowIf>
        </Grid>
      </ShowIf>

      <Dialog open={viewerIsOpen} fullScreen classes={{paper: style.alignment}}>
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
          navButtonsProps={{className: style.navButton}}>
          {list.images.map((image, i) => (
            <Paper key={i} className={style.preview}>
              <img src={image.sizes.large} alt="" className={style.image} />
            </Paper>
          ))}
        </Carousel>
      </Dialog>
    </div>
  );
};

export default Gallery;
