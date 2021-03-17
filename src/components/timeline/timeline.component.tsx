import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { Post } from '../../interfaces/post';
import { postData } from './data';
import PostComponent from './post.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      overflow: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      scrollbarColor: 'transparent transparent',
      '& ::-webkit-scrollbar': {
        display: 'none',
        width: '0 !important'
      }
    },
    scroll: {
      height: '100%',
      width: '100%',
      overflowY: 'auto'
    },
    child: {
      '& > *': {
        margin: theme.spacing(1)
      }
    }
  })
);

export default function Timeline() {
  const classes = useStyles();
  const scrollRoot = React.createRef<HTMLDivElement>();
  const [posts, setPost] = React.useState<Post[]>([]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    setPost(postData);
  }, []);

  const handleScroll = React.useCallback(() => {
    const distance = window.scrollY;

    if (distance <= 0) return;

    window.requestAnimationFrame(() => {
      if (scrollRoot.current) {
        scrollRoot.current.scroll(0, distance);
      }
    });
  }, []);

  const fetchData = () => {
    console.log('Fetch data');
  };

  return (
    <div className={classes.root}>
      <div className={classes.scroll} ref={scrollRoot}>
        <InfiniteScroll
          className={classes.child}
          dataLength={100}
          next={fetchData}
          hasMore={true}
          loader={<CircularProgress disableShrink />}>
          {posts.map((post, i) => (
            <PostComponent post={post} open={true} key={`${post.user.name}-${i}`} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
