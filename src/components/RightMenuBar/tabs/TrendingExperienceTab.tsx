import {InformationCircleIcon} from '@heroicons/react/outline';

import React from 'react';
import {useSelector} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {Skeleton} from '../../Expericence';
import {useStyles} from './Tab.style';

import {ExperienceListContainer} from 'src/components/ExperienceList';
import ShowIf from 'src/components/common/show-if.component';
import {ExperienceOwner, useExperienceHook} from 'src/hooks/use-experience-hook';
import {RootState} from 'src/reducers';
import {ExperienceState} from 'src/reducers/experience/reducer';

export const TrendingExperienceTab: React.FC = () => {
  const {loadTrendingExperience, loading} = useExperienceHook();
  const styles = useStyles();
  const {trendingExperiences} = useSelector<RootState, ExperienceState>(
    state => state.experienceState,
  );
  const toolTipText =
    'Show the top 10 experiences based on total subscribers and clone in 24 hours.';

  React.useEffect(() => {
    loadTrendingExperience();
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.flex}>
        <Typography variant={'h4'} style={{color: '#404040'}}>
          Trending Experience
        </Typography>
        <Tooltip title={toolTipText} arrow>
          <IconButton aria-label="info" className={styles.info} style={{color: '#404040'}}>
            <SvgIcon component={InformationCircleIcon} viewBox="0 0 24 24" />
          </IconButton>
        </Tooltip>
      </div>
      <ExperienceListContainer selectable filterTimeline owner={ExperienceOwner.TRENDING} />

      <ShowIf condition={loading && trendingExperiences.length === 0}>
        <Grid container justifyContent="center">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Grid>
      </ShowIf>
    </div>
  );
};

export default TrendingExperienceTab;
