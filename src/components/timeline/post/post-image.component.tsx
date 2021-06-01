import React from 'react';
import Carousel, { CarouselStyles } from 'react-images';
import ReactPhotoGrid from 'react-photo-grid';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import IconButton from '@material-ui/core/IconButton';
import NoSsr from '@material-ui/core/NoSsr';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';

import ShowIf from 'src/components/common/show-if.component';
import { ImageData } from 'src/interfaces/post';
import theme from 'src/themes/light';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
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
  const [viewerIsOpen, setViewerIsOpen] = React.useState(false);

  const openLightbox = () => {
    setViewerIsOpen(true);
  };

  const closeLightbox = () => {
    setViewerIsOpen(false);
  };

  return (
    <div className={style.root}>
      <NoSsr>
        <ShowIf condition={images.length > 1}>
          <ReactPhotoGrid onImageClick={openLightbox} data={images.slice(0, 3).map(image => image.src)} containerWidth={720} />
        </ShowIf>
        <ShowIf condition={images.length === 1}>
          <GridList cellHeight={400} cols={1} onClick={openLightbox}>
            {images.map((image, i) => (
              <GridListTile key={image.src} cols={1}>
                <img src={image.src} />
              </GridListTile>
            ))}
          </GridList>
        </ShowIf>

        <Dialog open={viewerIsOpen} fullScreen={fullScreen} className={style.transparentHeader}>
          <MuiDialogTitle>
            <IconButton color="primary" aria-label="close" size="small" onClick={closeLightbox}>
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>

          <Carousel styles={carouselStyle} views={images.map((image, i) => ({ source: image.src, key: i }))} />
        </Dialog>
      </NoSsr>
    </div>
  );
}
