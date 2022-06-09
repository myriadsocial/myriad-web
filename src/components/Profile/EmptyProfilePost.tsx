import React from 'react';

import {createStyles, makeStyles, Theme} from '@material-ui/core';

import {Empty} from '../atoms/Empty';
import ShowIf from '../common/show-if.component';

import i18n from 'src/locale';

type EmptyPostProps = {
  owner: boolean;
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'transparent',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px 0',

      [theme.breakpoints.down('xs')]: {
        padding: 20,
      },
    },
  }),
);

export const EmptyProfilePost: React.FC<EmptyPostProps> = ({owner}) => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <ShowIf condition={owner}>
        <Empty
          title={i18n.t('Profile.Empty.Title_Own')}
          subtitle={i18n.t('Profile.Empty.Subtitle_Own')}
        />
      </ShowIf>

      <ShowIf condition={!owner}>
        <Empty title={i18n.t('Profile.Empty.Title')} subtitle={i18n.t('Profile.Empty.Subtitle')} />
      </ShowIf>
    </div>
  );
};
