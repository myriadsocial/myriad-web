import React from 'react';

import Typography from '@material-ui/core/Typography';

import {TopicListComponent} from '../../components/topic/topic-list.component';
import {useStyles} from './trending-tab-panel.styles';

import {Tag} from 'src/interfaces/experience';

type TrendingTabPanelProps = {
  trending: Tag[];
};

export const TrendingTabPanel: React.FC<TrendingTabPanelProps> = props => {
  const {trending} = props;
  const styles = useStyles();

  return (
    <div className={styles.root} id="worldwide">
      <div className={styles.content}>
        <div style={{paddingTop: 24, paddingBottom: 8}}>
          <Typography variant="h4" style={{marginBottom: 8}}>
            {'Trends'}
          </Typography>
        </div>

        <TopicListComponent topics={trending} />
      </div>
    </div>
  );
};
