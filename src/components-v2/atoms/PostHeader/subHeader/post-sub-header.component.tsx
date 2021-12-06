import React from 'react';

import Link from 'next/link';

import Typography from '@material-ui/core/Typography';

import {PostSubHeaderProps} from './post-sub-header.interface';
import {useStyles} from './post-sub-header.style';

import {format} from 'date-fns';
import ShowIf from 'src/components/common/show-if.component';

export const PostSubHeader: React.FC<PostSubHeaderProps> = ({
  postId,
  date,
  platform,
  importers,
  url,
}) => {
  const style = useStyles();

  const getDate = (datePost: Date) => {
    const newFormat = format(new Date(datePost), 'd MMM y');
    return newFormat;
  };

  console.log('URL', url, postId);

  return (
    <Typography component="div" className={style.root}>
      {platform === 'myriad' && (
        <Link href={`/post/${postId}`}>
          <a href={`/post/${postId}`} className={style.linkGrey}>
            {getDate(date)}
          </a>
        </Link>
      )}

      {importers && importers.length && (
        <>
          Imported on&nbsp;
          <Link href={`/post/${postId}`}>
            <a href={`/post/${postId}`} className={style.linkGrey}>
              {getDate(date)}
            </a>
          </Link>
          &nbsp;by&nbsp;
          <>
            {importers.map((importer, i) => (
              <>
                <Link key={importer.id} href={`/profile/${importer.id}`}>
                  <a href={`/profile/${importer.id}`} className={style.link}>
                    {importer.name}
                  </a>
                </Link>
                <ShowIf condition={i < importers.length - 2}>&nbsp;&#44;&nbsp;</ShowIf>
                <ShowIf condition={i < importers.length - 1}>&nbsp;&amp;&nbsp;</ShowIf>
              </>
            ))}
          </>
          &nbsp;via&nbsp;
          <Link href={url}>
            <a href={url} className={style.link} target="_blank" rel="noreferrer">
              {platform}
            </a>
          </Link>
        </>
      )}
    </Typography>
  );
};
