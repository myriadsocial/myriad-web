import React from 'react';

import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MyriadFullIcon} from 'src/components/atoms/Icons';
import i18n from 'src/locale';

type MobileLoginViewProps = {
  anonymousLogin: () => void;
  height: number;
};

const useStyles = makeStyles<Theme, MobileLoginViewProps>(theme =>
  createStyles({
    root: {
      position: 'relative',
      background: '#FFF',
      height: '100vh',
      paddingTop: 200,
      textAlign: 'center',
    },
    logo: {
      marginBottom: theme.spacing(3),
    },
    title: {
      lineHeight: '22.5px',
      marginBottom: theme.spacing(1),
      fontWeight: 600,
      fontSize: 18,
    },
    subtitle: {
      lineHeight: '20px',
      fontSize: 12,
      paddingRight: 20,
      paddingLeft: 20,
    },
    mb2: {
      marginBottom: theme.spacing(2),
    },
    button: {
      position: 'absolute',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bottom: props => (props.height < 700 ? '20px' : '80px'),
    },
    mb1: {
      marginBottom: theme.spacing(1.5),
    },
  }),
);

export const MobileLogin: React.FC<MobileLoginViewProps> = props => {
  const {anonymousLogin} = props;
  const style = useStyles({...props});

  return (
    <div className={style.root}>
      <Grid container direction="column" justifyContent="center" alignContent="center">
        <Grid item xs={12} className={style.logo}>
          <MyriadFullIcon />
        </Grid>
        <Grid item xs={12}>
          <Typography className={style.title}>{i18n.t('Mobile.title')}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={`${style.subtitle} ${style.mb2}`}>
            Sign in on mobile is not available yet. To access Myriad, you need to use desktop
            browser and install Polakdot.js
          </Typography>
        </Grid>
      </Grid>
      <div className={style.button}>
        <Button onClick={anonymousLogin} variant="contained" color="primary" className={style.mb1}>
          Sign in as anonymus
        </Button>
        <Button href="https://www.myriad.social/" variant="outlined" color="secondary">
          {i18n.t('Mobile.button_label')}
        </Button>
      </div>
    </div>
  );
};
