import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Skeleton } from '../../Expericence';
import { useStyles } from './Tab.style';

import { useFilterOption } from 'components/TimelineFilter/hooks/use-filter-option.hook';
import { DropdownMenu } from 'components/atoms/DropdownMenu';
import { ExperienceListContainer } from 'src/components/ExperienceList';
import ShowIf from 'src/components/common/show-if.component';
import {
  ExperienceOwner,
  useExperienceHook,
} from 'src/hooks/use-experience-hook';
import { Experience } from 'src/interfaces/experience';
import { TimelineFilterCreated } from 'src/interfaces/timeline';
import { User } from 'src/interfaces/user';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';

type TrendingExperienceTabProps = {
  menuDrawer?: boolean;
  showFilter?: boolean;
};

export const TrendingExperienceTab: React.FC<TrendingExperienceTabProps> =
  props => {
    const { menuDrawer = false, showFilter = true } = props;
    const styles = useStyles();
    const { loadTrendingExperience, loading, clearTrendingExperience } =
      useExperienceHook();
    const { createdFilter } = useFilterOption();

    const trendingExperiences = useSelector<RootState, Experience[]>(
      state => state.experienceState.trendingExperiences,
      shallowEqual,
    );

    const user = useSelector<RootState, User | undefined>(
      state => state.userState.user,
      shallowEqual,
    );

    React.useEffect(() => {
      clearTrendingExperience();
      loadTrendingExperience(1);
    }, []);

    const handleFilter = async (filter: TimelineFilterCreated) => {
      await clearTrendingExperience();
      const createdBy =
        filter === TimelineFilterCreated.ME
          ? `createdBy=${user.id}`
          : `createdBy[neq]=${user.id}`;
      loadTrendingExperience(1, createdBy);
    };

    return (
      <div className={styles.box}>
        <ShowIf condition={!menuDrawer}>
          <ShowIf condition={showFilter}>
            <div className={styles.flex}>
              <Typography variant={'h5'} className={styles.title}>
                {trendingExperiences.length ?? 0} Timelines
              </Typography>

              <DropdownMenu<TimelineFilterCreated>
                title={i18n.t('Post_Sorting.Title_Filter')}
                options={createdFilter}
                onChange={handleFilter}
                marginTop={false}
                marginBottom={false}
                placeholder={'Select'}
              />
            </div>
          </ShowIf>
        </ShowIf>

        <ExperienceListContainer
          noButton
          selectable
          enableClone
          enableSubscribe
          filterTimeline
          owner={ExperienceOwner.TRENDING}
          menuDrawer={menuDrawer}
        />

        <ShowIf condition={loading && trendingExperiences.length === 0}>
          <Grid container justifyContent="center">
            <Skeleton menuDrawer={menuDrawer} />
            <Skeleton menuDrawer={menuDrawer} />
            <Skeleton menuDrawer={menuDrawer} />
          </Grid>
        </ShowIf>
      </div>
    );
  };

export default TrendingExperienceTab;
