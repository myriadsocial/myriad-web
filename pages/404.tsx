import React from 'react';

import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import Illustration from 'src/images/404_Page_Not_Found__Isometric_2_1.svg';
import Logo from 'src/images/Myriad_Full_Logo_Color_1-01_1.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      textAlign: 'center',
      background: '#FFF',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      marginBottom: 32,
    },
    illustration: {},
    bar: {
      background: '#FFC857',
      position: 'absolute',
      width: '1.48vw',
      height: '100%',
      left: 0,
      top: 0,
    },
    title: {
      lineHeight: '33.6px',
      marginBottom: 20,
      fontWeight: 700,
      fontSize: 28,
      [theme.breakpoints.down(1346)]: {
        marginBottom: 8,
        fontSize: 20,
      },
    },
    subtitle: {
      lineHeight: '25.1px',
      marginBottom: 84,
      fontSize: 20,
      [theme.breakpoints.down(1346)]: {
        marginBottom: 42,
        fontSize: 14,
      },
    },
    button: {},
  }),
);

const NotFound: React.FC = () => {
  const style = useStyles();
  const router = useRouter();

  const handleAction = () => {
    router.push('/', undefined, {shallow: false});
  };

  return (
    <div className={style.root}>
      <div>
        <div className={style.bar} />
        <div className={style.logo}>
          <Logo />
        </div>
        <div className={style.illustration}>
          <Illustration />
        </div>
        <Typography className={style.title}>
          Whoops! You&rsquo;ve moved so fast and you got lost
        </Typography>
        <Typography className={style.subtitle}>
          The page you are looking for is not found&nbsp;
          <span aria-label="sad" role="img">
            😢
          </span>
        </Typography>
        <Button onClick={handleAction} className={style.button} variant="contained" color="primary">
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
