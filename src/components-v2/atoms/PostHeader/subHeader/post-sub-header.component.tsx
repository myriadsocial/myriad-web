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
  importers = [],
  totalImporters,
  url,
}) => {
  const style = useStyles();

  const getDate = (datePost: Date): string => {
    return format(new Date(datePost), 'd MMM y');
  };

  return (
    <Typography component="div" className={style.root}>
      <ShowIf condition={platform !== 'myriad'}>Imported on&nbsp;</ShowIf>

      <Link href={`/post/${postId}`}>
        <a href={`/post/${postId}`} className={style.linkGrey}>
          {getDate(date)}&nbsp;
        </a>
      </Link>

      <ShowIf condition={platform !== 'myriad'}>
        {totalImporters > 0 && (
          <>
            by&nbsp;
            {importers.map((importer, i) => (
              <>
                <Link key={importer.id} href={`/profile/${importer.id}`}>
                  <a href={`/profile/${importer.id}`} className={style.link}>
                    {importer.name}
                  </a>
                </Link>
                <ShowIf condition={i < importers.length - 2 && importers.length > 1}>
                  &#44;&nbsp;
                </ShowIf>
                <ShowIf
                  condition={i === importers.length - 1 && totalImporters > importers.length - 1}>
                  &nbsp;and&nbsp;
                </ShowIf>
              </>
            ))}
            <ShowIf condition={totalImporters - importers.length > 0}>
              {totalImporters - importers.length} other
            </ShowIf>
            &nbsp;via&nbsp;
            <Link href={url}>
              <a href={url} className={style.link} target="_blank" rel="noreferrer">
                {platform}
              </a>
            </Link>
          </>
        )}
      </ShowIf>
    </Typography>
  );
};
