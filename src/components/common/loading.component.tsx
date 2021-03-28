import React from 'react';

import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@global': {
      //need add into global rules
      '@keyframes changeColor': {
        '12.5%': {
          color: '#FF0000'
        },
        '25%': {
          color: '#FFA500'
        },
        '37.5%': {
          color: '#FFFF00'
        },
        '50%': {
          color: '#7FFF00'
        },
        '62.5%': {
          color: '#00FFFF'
        },
        '75%': {
          color: '#0000FF'
        },
        '87.5%': {
          color: '#9932CC'
        },
        '100%': {
          color: '#FF1493'
        }
      }
    },
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme.palette.background.default
    },
    circularProgress: {
      animation: 'MuiCircularProgress-keyframes-circular-rotate 1.4s linear infinite, changeColor 2s linear infinite'
    }
  })
);

export const LoadingPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <CircularProgress thickness={5} size={isMobile ? 75 : 100} disableShrink className={classes.circularProgress} />
    </div>
  );
};
