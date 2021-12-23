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
  onImporters,
}) => {
  const style = useStyles();

  const getDate = (datePost: Date): string => {
    return format(new Date(datePost), 'd MMM y');
  };

  const handleImporterList = () => {
    onImporters();
  };

  return (
    <>
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
              {importers.map(importer => (
                <>
                  <Link key={importer.id} href={`/profile/${importer.id}`}>
                    <a href={`/profile/${importer.id}`} className={style.link}>
                      {importer.name}
                    </a>
                  </Link>
                  <ShowIf condition={totalImporters > 1}>&nbsp;and&nbsp;</ShowIf>
                </>
              ))}
              <ShowIf condition={importers.length === 0}>
                <span
                  className={style.link}
                  style={{cursor: 'pointer'}}
                  onClick={handleImporterList}>
                  {totalImporters}&nbsp;
                  <ShowIf condition={totalImporters === 1}>other</ShowIf>
                  <ShowIf condition={totalImporters > 1}>others</ShowIf>
                </span>
              </ShowIf>
              <ShowIf condition={importers.length > 0 && totalImporters > importers.length}>
                <span
                  className={style.link}
                  style={{cursor: 'pointer'}}
                  onClick={handleImporterList}>
                  {totalImporters - importers.length}&nbsp;
                  <ShowIf condition={totalImporters - importers.length === 1}>other</ShowIf>
                  <ShowIf condition={totalImporters - importers.length > 1}>others</ShowIf>
                </span>
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
    </>
  );
};
