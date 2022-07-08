import {ArrowNarrowUpIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Button, SvgIcon} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './Timeline.styles';

import {useTimelineFilter} from 'components/PostList/hooks/use-timeline-filter.hook';
import ShowIf from 'components/common/show-if.component';
import {useScroll} from 'src/hooks/use-scroll.hook';
import i18n from 'src/locale';
import {checkNewTimeline} from 'src/reducers/timeline/actions';

type TimelineAutoReloaderProps = {
  loading?: boolean;
};

export const TimelineAutoReloader: React.FC<TimelineAutoReloaderProps> = props => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();
  const {scrollPosition} = useScroll();
  const {loading, filterTimeline} = useTimelineFilter();

  const [newPostCount, setNewPostCount] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkNewTimeline(setNewPostCount));
    }, 120000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    setNewPostCount(0);

    filterTimeline();
  };

  const handleLoadPost = () => {
    setNewPostCount(0);

    filterTimeline(router.query);
  };

  return (
    <div className={styles.root}>
      <ShowIf condition={newPostCount > 0 && !loading}>
        <div className={styles.wrapperLoadPost} onClick={handleLoadPost}>
          <Typography color="primary">{i18n.t('Post_Lists.Load_New_Posts')}</Typography>
          <div className={styles.badge}>
            <Typography className={styles.badgeText}>
              {newPostCount > 50 ? '50+' : newPostCount}
            </Typography>
          </div>
        </div>
      </ShowIf>

      <ShowIf condition={scrollPosition > 0.23 && newPostCount > 0}>
        <Button
          color="primary"
          variant="contained"
          className={styles.btnScrollTop}
          onClick={scrollToTop}
          startIcon={<SvgIcon component={ArrowNarrowUpIcon} viewBox="0 0 24 24" />}>
          {i18n.t('Post_Lists.New_Posts')}
        </Button>
      </ShowIf>
    </div>
  );
};
