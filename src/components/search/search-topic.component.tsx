import React, {createRef, useCallback, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import {ScrollTop} from 'src/components/common/ScrollToTop.component';
import {LoadingPage} from 'src/components/common/loading.component';
import PostComponent from 'src/components/post/post.component';
import {useTimelineFilter} from 'src/components/timeline/use-timeline-filter.hook';
import {isOwnPost} from 'src/helpers/post';
import {useModal} from 'src/hooks/use-modal.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {useTimelineHook} from 'src/hooks/use-timeline.hook';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const TipSummaryComponent = dynamic(
  () => import('src/components/tip-summary/tip-summary.component'),
);

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '1200px',
      overflow: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      scrollbarColor: 'transparent transparent',
      '& ::-webkit-scrollbar': {
        display: 'none',
        width: '0 !important',
      },
    },
    scroll: {
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    child: {
      '& > *': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    mt: {
      marginTop: theme.spacing(2),
    },
    content: {
      textAlign: 'center',
      lineHeight: '20px',
      fontSize: '16px',
      color: '#9E9E9E',
      width: '282px',
    },
  }),
);

type TopicSearchResultProps = {
  isAnonymous?: boolean;
};

const TopicSearchComponent: React.FC<TopicSearchResultProps> = () => {
  const {user, currencies: availableTokens} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const scrollRoot = createRef<HTMLDivElement>();
  const style = useStyles();
  const {query} = useRouter();

  const {load} = usePolkadotApi();
  const {hasMore, nextPage, posts} = useTimelineHook();
  const {searchTimeline} = useTimelineFilter();
  const {toggle} = useModal();

  useEffect(() => {
    searchTimeline(query);
  }, [query]);

  useEffect(() => {
    if (user?.id) {
      load(user.id, availableTokens);
    }
  }, [user]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
  }, []);

  const handleScroll = useCallback(() => {
    const distance = window.scrollY;

    if (distance <= 0) return;

    window.requestAnimationFrame(() => {
      if (scrollRoot.current) {
        scrollRoot.current.scroll(0, distance);
      }
    });
  }, []);

  if (!posts.length)
    return (
      <Grid container justify="center" className={style.mt}>
        <Typography className={style.content}>
          Sorry we can’t find anything with your keyword, you can try again with another keyword
        </Typography>
      </Grid>
    );

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        <div>
          <InfiniteScroll
            scrollableTarget="scrollable-timeline"
            className={style.child}
            dataLength={posts.length}
            next={nextPage}
            hasMore={hasMore}
            loader={<LoadingPage />}>
            {posts.map((post: Post, i: number) => (
              <div key={post.id} id={`post-detail-${i}`}>
                <PostComponent
                  post={post}
                  postOwner={isOwnPost(post, user)}
                  tippingClicked={toggle}
                />
              </div>
            ))}
          </InfiniteScroll>
        </div>

        <TipSummaryComponent />
        <ScrollTop>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </div>
    </div>
  );
};

export default TopicSearchComponent;
