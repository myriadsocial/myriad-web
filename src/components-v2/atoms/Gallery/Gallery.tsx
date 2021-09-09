import React from 'react';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import {Sizes} from '../../../interfaces/assets';
import {useStyles} from './gallery.styles';
import {buildList} from './util';

type GalleryProps = {
  images: Sizes[];
  onImageClick: (index: number) => void;
};

export const Gallery: React.FC<GalleryProps> = ({images, onImageClick}) => {
  const style = useStyles();

  const list = buildList(images);

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
