import React from 'react';

import Link from 'next/link';

import Typography from '@material-ui/core/Typography';

import {PostSubHeaderProps} from './post-sub-header.interface';
import {useStyles} from './post-sub-header.style';

import {format} from 'date-fns';

export const PostSubHeader: React.FC<PostSubHeaderProps> = ({date, platform, importer}) => {
  const style = useStyles();

  const getDate = (datePost: Date) => {
    const newFormat = format(new Date(datePost), 'd MMM y');
    return newFormat;
  };

  return (
    <Typography component="div" className={style.root}>
      {platform === 'myriad' && getDate(date)}
      {importer && (
        <>
          Imported on {getDate(date)} by{' '}
          <Link href={'/#'}>
            <a href={'/#'} className={style.link}>
              {importer.name}
            </a>
          </Link>{' '}
          via{' '}
          <Link href={'/#'}>
            <a href={'/#'} className={style.link} target="_blank" rel="noreferrer">
              {platform}
            </a>
          </Link>
        </>
      )}
    </Typography>
  );
};
