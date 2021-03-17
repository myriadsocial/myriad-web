import React from 'react';
import uniqid from 'uniqid';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import LoginForm from '../src/components/login/login.component';
import PostComponent from '../src/components/timeline/post.component';
import Logo from '../src/images/logo.svg';
import { Post } from '../src/interfaces/post';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'linear-gradient(110.43deg, #A942E9 0%, rgba(255, 255, 255, 0) 100.48%), #FFFFFF',
      padding: '24px 36px',
      minHeight: '100vh'
    },
    logo: {
      marginRight: theme.spacing(1.5)
    },
    info: {
      width: 328,
      background: 'rgba(255, 255, 255, 0.41)',
      borderRadius: 15,
      padding: theme.spacing(2),
      color: '#000000'
    },
    login: {
      marginTop: 140,
      width: 320,
      marginRight: 65
    },
    timeline: {
      padding: '16px 24px!important',
      position: 'relative',
      backgroundImage: 'url(/images/timeline.svg)',
      backgroundSize: 'cover',
      '& > div': {
        marginBottom: 10
      }
    }
  })
);

export default function About() {
  const style = useStyles();

  const posts: Post[] = [
    {
      text: 'I am going to post something very controversial...',
      user: {
        id: uniqid(),
        avatar: 'JD',
        name: 'John Doe'
      },
      origin: 'facebook',
      replies: [
        {
          text: 'people will be like “idk i’m on the fence about this issue” and the issue will be a genocide.',
          user: {
            id: uniqid(),
            avatar: 'R',
            name: 'Test'
          }
        }
      ]
    },
    {
      text: 'I am going to post something very controversial...',
      user: {
        id: uniqid(),
        avatar: 'JD',
        name: 'Eduard Rudd'
      },
      origin: 'facebook'
    }
  ];

  return (
    <div className={style.root}>
      <Grid container spacing={3} justify="space-around">
        <Grid container item md={6} lg={6} direction="column" spacing={3}>
          <Grid container item direction="row">
            <Logo className={style.logo} />
            <Paper className={style.info}>
              <Typography>
                A social platform that’s entirely under your control. Remain anonymous, look for your own topics, choose your interface and
                control what you see.
              </Typography>
            </Paper>
          </Grid>
          <Grid item className={style.timeline}>
            {posts.map(post => (
              <PostComponent post={post} open={true} disable />
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <div className={style.login}>
            <LoginForm />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
