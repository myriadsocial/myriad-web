import {XIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';

import NextImage from 'next/image';

import {Grid, IconButton, SvgIcon, useMediaQuery, useTheme} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {Skeleton} from '../../File.skeleton';

import ShowIf from 'components/common/show-if.component';

type PreviewMultipleProps = {
  files: string[];
  width?: number;
  height?: number;
  disableRemove: boolean;
  onRemoveFile: (index) => void;
};

export const useStyles = makeStyles<Theme>(theme =>
  createStyles({
    root: {
      width: 665,
      [theme.breakpoints.down('xs')]: {
        width: 256,
      },
    },
    image: {
      position: 'relative',
    },
    loader: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    icon: {
      filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.16))',
      color: theme.palette.primary.main,
      background: '#FFF',
      padding: 0,
      height: 24,
      width: 24,
      fontSize: '1rem',
      position: 'absolute',
      top: 0,
      right: 0,

      '&:hover': {
        background: '#FFF',
      },
    },
  }),
);

export const Multiple: React.FC<PreviewMultipleProps> = props => {
  const {files, width, height, disableRemove, onRemoveFile} = props;

  const styles = useStyles();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    setPreviews(
      files.map(url => ({
        url,
        loading: true,
      })),
    );
  }, [files]);

  const cols = files.length === 1 ? 12 : 4;
  const colWidth = width ?? cols === 4 ? (isMobile ? 80 : 215) : isMobile ? 220 : 605;
  const colHeight = height ?? cols === 4 ? (isMobile ? 80 : 112) : isMobile ? 120 : 315;

  const updateLoading = (index: number) => () => {
    setPreviews(prev => {
      return prev.map((item, i) => {
        if (i === index) {
          item.loading = false;
        }

        return item;
      });
    });
  };

  const removeFile = (index: number) => () => {
    onRemoveFile(index);
  };

  return (
    <Grid container className={styles.root} spacing={2}>
      {previews.map((preview, i) => (
        <Grid item key={i} xs={cols} className={styles.image}>
          <NextImage
            src={preview.url}
            width={colWidth}
            height={colHeight}
            layout="responsive"
            objectFit="cover"
            objectPosition="center"
            onLoadingComplete={updateLoading(i)}
          />

          <ShowIf condition={preview.loading}>
            <span className={styles.loader}>
              <Skeleton width={colWidth} height={colHeight} />
            </span>
          </ShowIf>

          <IconButton
            disabled={disableRemove}
            size="small"
            aria-label="remove image"
            onClick={removeFile(i)}
            className={styles.icon}>
            <SvgIcon component={XIcon} style={{fontSize: '1rem'}} />
          </IconButton>
        </Grid>
      ))}
    </Grid>
  );
};

export default Multiple;
