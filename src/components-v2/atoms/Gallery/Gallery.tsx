import React from 'react';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import {useStyles} from './Gallery.styles';
import {GalleryType} from './Gallery.types';
import {buildList} from './util';

type GalleryProps = {
  images: string[];
  variant?: GalleryType;
  cloudName: string;
  onImageClick: (index: number) => void;
};

export const Gallery: React.FC<GalleryProps> = props => {
  const {images, cloudName, variant = 'horizontal', onImageClick} = props;

  const style = useStyles();

  const list = buildList(images, variant, cloudName);

  const handleImageClick = (index: number) => () => {
    onImageClick(index);
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
    </div>
  );
};
