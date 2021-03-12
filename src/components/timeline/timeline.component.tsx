import React from 'react';
import useAxios from 'axios-hooks';
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
      '& ::-webkit-scrollbar': {
        display: 'none'
      }
    },
    scroll: {
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column-reverse'
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

  const [{ data, loading }] = useAxios('https://picsum.photos/v2/list?limit=6');

  const posts: Post[] = [
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
      images: loading
        ? []
        : data.map(item => ({
            url: item.download_url,
            title: item.author,
            cols: Math.round(item.height / item.width)
          }))
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
      <div className={classes.scroll}>
        <InfiniteScroll
          className={classes.child}
          dataLength={100}
          next={fetchData}
          hasMore={true}
          loader={<CircularProgress disableShrink />}>
          {posts.map(post => (
            <PostComponent post={post} open={true} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
