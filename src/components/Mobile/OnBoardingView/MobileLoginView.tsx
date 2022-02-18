import React from 'react';

import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {MyriadFullIcon} from 'src/components/atoms/Icons';
import i18n from 'src/locale';

type MobileLoginViewProps = {
  anonymousLogin: () => void;
};

const useStyles = makeStyles<Theme, MobileLoginViewProps>(theme =>
  createStyles({
    root: {
      background: '#FFF',
      minHeight: '100vh',
      width: '100vw',
      paddingTop: 160,
      paddingBottom: 28,
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
    mb10: {
      marginBottom: theme.spacing(10),
    },
    button: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
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
    <Grid
      container
      direction="column"
      justifyContent="space-between"
      alignContent="center"
      className={style.root}>
      <Grid item>
        <Grid item className={style.logo}>
          <MyriadFullIcon />
        </Grid>
        <Grid item>
          <Typography className={style.title}>{i18n.t('Mobile.title')}</Typography>
        </Grid>
        <Grid item>
          <Typography className={`${style.subtitle} ${style.mb10}`}>
            {i18n.t('Mobile.subtitle_3')}
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <div className={style.button}>
          <Button
            onClick={anonymousLogin}
            variant="contained"
            color="primary"
            className={style.mb1}>
            {i18n.t('Mobile.button_label_sign_in')}
          </Button>
          <Button href="https://www.myriad.social/" variant="outlined" color="secondary">
            {i18n.t('Mobile.button_label')}
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};
