import {InformationCircleIcon} from '@heroicons/react/outline';

import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
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
import {Experience} from 'src/interfaces/experience';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';

export const TrendingExperienceTab: React.FC = () => {
  const styles = useStyles();
  const router = useRouter();
  const {loadTrendingExperience, loading} = useExperienceHook();

  const trendingExperiences = useSelector<RootState, Experience[]>(
    state => state.experienceState.trendingExperiences,
    shallowEqual,
  );
  const toolTipText = i18n.t('Tooltip.Trending_Exp');

  React.useEffect(() => {
    loadTrendingExperience();
  }, []);

  const handleViewAll = () => {
    router.push('/search?type=experience&q=', undefined, {shallow: true});
  };

  return (
    <div className={styles.box}>
      <div className={styles.flex}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
          <Typography variant={'h4'} style={{color: '#404040'}}>
            {i18n.t('Section.Trending_Experience')}
          </Typography>
          <Tooltip title={toolTipText} arrow>
            <IconButton aria-label="info" className={styles.info} style={{color: '#404040'}}>
              <SvgIcon
                style={{fontSize: 18}}
                component={InformationCircleIcon}
                viewBox="0 0 24 24"
              />
            </IconButton>
          </Tooltip>
        </div>
        <Button
          variant="text"
          style={{width: 'auto', height: 'auto', padding: 1}}
          color="primary"
          onClick={handleViewAll}>
          View all
        </Button>
      </div>
      <ExperienceListContainer
        selectable
        enableClone
        enableSubscribe
        filterTimeline
        owner={ExperienceOwner.TRENDING}
      />

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
