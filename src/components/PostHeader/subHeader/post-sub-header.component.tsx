import React from 'react';

import Link from 'next/link';

import Typography from '@material-ui/core/Typography';

import {ExperienceInfo} from '../ExperienceInfo/ExperienceInfo';
import {PostSubHeaderProps} from './post-sub-header.interface';
import {useStyles} from './post-sub-header.style';

import ShowIf from 'src/components/common/show-if.component';
import {timeAgo} from 'src/helpers/date';
import i18n from 'src/locale';

export const PostSubHeader: React.FC<PostSubHeaderProps> = ({
  postId,
  date,
  platform,
  importers = [],
  totalImporters,
  url,
  onImporters,
  totalExperience,
  experiences,
}) => {
  const style = useStyles();

  const handleImporterList = () => {
    onImporters();
  };

  return (
    <>
      <Typography component="div" className={style.root}>
        <ShowIf condition={platform !== 'myriad'}>{i18n.t('Post_Detail.Imported_Post')} </ShowIf>
        <Link href={`/post/[postId]`} as={`/post/${postId}`} shallow prefetch={false}>
          <a className={style.linkGrey}>{timeAgo(date)}&nbsp;</a>
        </Link>
        <ShowIf condition={platform !== 'myriad'}>
          {totalImporters > 0 && (
            <>
              {i18n.t('Post_Detail.by')}&nbsp;
              {importers.map(importer => (
                <span key={importer.id}>
                  <Link
                    href={'/profile/[id]'}
                    as={`/profile/${importer.id}`}
                    shallow
                    prefetch={false}>
                    <a className={style.link}>{importer.name}</a>
                  </Link>
                  <ShowIf condition={totalImporters > 1}>
                    &nbsp;{i18n.t('Post_Detail.and')}&nbsp;
                  </ShowIf>
                </span>
              ))}
              <ShowIf condition={importers.length === 0}>
                <span className={style.link} onClick={handleImporterList}>
                  {totalImporters}&nbsp;
                  <ShowIf condition={totalImporters === 1}>{i18n.t('Post_Detail.other')}</ShowIf>
                  <ShowIf condition={totalImporters > 1}>{i18n.t('Post_Detail.others')}</ShowIf>
                </span>
              </ShowIf>
              <ShowIf condition={importers.length > 0 && totalImporters > importers.length}>
                <span className={style.link} onClick={handleImporterList}>
                  {totalImporters - importers.length}&nbsp;
                  <ShowIf condition={totalImporters - importers.length === 1}>
                    {i18n.t('Post_Detail.other')}
                  </ShowIf>
                  <ShowIf condition={totalImporters - importers.length > 1}>
                    {i18n.t('Post_Detail.others')}
                  </ShowIf>
                </span>
              </ShowIf>
              &nbsp;{i18n.t('Post_Detail.via')}&nbsp;
              <a href={url} className={style.link} target="_blank" rel="noreferrer">
                {platform}
              </a>
            </>
          )}
        </ShowIf>
        <ShowIf condition={totalExperience > 0}>
          <ExperienceInfo
            postId={postId}
            totalExperience={totalExperience}
            experiences={experiences}
          />
        </ShowIf>
      </Typography>
    </>
  );
};
