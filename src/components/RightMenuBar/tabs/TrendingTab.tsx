import React from 'react';

import { Typography } from '@material-ui/core';

import { useStyles } from './Tab.style';

import { TrendingListContainer } from 'src/components/Trending';
import i18n from 'src/locale';

export const TrendingTab: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root} id="worldwide">
      <div className={styles.content}>
        <Typography variant="h4">{i18n.t('TrendingHashtag')}</Typography>
        <TrendingListContainer />
      </div>
    </div>
  );
};

export default TrendingTab;
