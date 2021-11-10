import React from 'react';

import Link from 'next/link';

import Typography from '@material-ui/core/Typography';

import {PostSubHeaderProps} from './post-sub-header.interface';
import {useStyles} from './post-sub-header.style';

import {format} from 'date-fns';

export const PostSubHeader: React.FC<PostSubHeaderProps> = ({
  postId,
  date,
  platform,
  importer,
  url,
}) => {
  const style = useStyles();

  const getDate = (datePost: Date) => {
    const newFormat = format(new Date(datePost), 'd MMM y');
    return newFormat;
  };

  return (
    <Typography component="div" className={style.root}>
      {platform === 'myriad' && (
        <Link href={`/post/${postId}`}>
          <a href={`/post/${postId}`} className={style.linkGrey}>
            {getDate(date)}
          </a>
        </Link>
      )}

      {importer && (
        <>
          Imported on&nbsp;
          <Link href={`/post/${postId}`}>
            <a href={`/post/${postId}`} className={style.linkGrey}>
              {getDate(date)}
            </a>
          </Link>
          &nbsp;by&nbsp;
          <Link href={`/profile/${importer.id}`}>
            <a href={`/profile/${importer.id}`} className={style.link}>
              {importer.name}
            </a>
          </Link>
          &nbsp;via&nbsp;
          <Link href={url ? url : '#'}>
            <a href={url ? url : '#'} className={style.link} target="_blank" rel="noreferrer">
              {platform}
            </a>
          </Link>
        </>
      )}
    </Typography>
  );
};
