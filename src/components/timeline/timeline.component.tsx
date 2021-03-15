import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import PostComponent from './post.component';
import { Post } from '../../interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
      width: '100%',
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

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
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

  const posts: Post[] = [
    {
      text: 'I am sharing on facebook...',
      user: {
        avatar: 'JD',
        name: 'John Doe'
      },
      videos: ['https://www.facebook.com/facebook/videos/10153231379946729/']
    },
    {
      text: 'I am going to post something very controversial...',
      user: {
        avatar: 'JD',
        name: 'John Doe'
      },
      replies: [
        {
          text: 'people will be like “idk i’m on the fence about this issue” and the issue will be a genocide.',
          user: {
            avatar: 'R',
            name: 'Test'
          }
        }
      ]
    },
    {
      text: 'I am going to post something very controversial...',
      user: {
        avatar: 'R',
        name: 'Eduard Rudd'
      },
      images: [
        {
          title: 'image',
          src: 'https://source.unsplash.com/2ShvY8Lf6l0/800x599',
          width: 2,
          height: 1
        },
        {
          title: 'image',
          src: 'https://source.unsplash.com/Dm-qxdynoEc/800x799',
          width: 1,
          height: 1
        },
        {
          title: 'image',
          src: 'https://source.unsplash.com/qDkso9nvCg0/600x799',
          width: 3,
          height: 4
        }
      ]
    },
    {
      text: 'Trump at CPAC: Says might run again...',
      user: {
        avatar: 'R',
        name: 'Eduard Rudd'
      },
      videos: ['https://youtu.be/KJTlo4bQL5c']
    }
  ];

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
