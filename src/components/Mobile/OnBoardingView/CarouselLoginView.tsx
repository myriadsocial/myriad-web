import React from 'react';
import Carousel from 'react-material-ui-carousel';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import Illustration from 'src/images/illustration/Ilustrasi_1.svg';
import Illustration2 from 'src/images/illustration/Ilustrasi_2.svg';
import Illustration3 from 'src/images/illustration/Ilustrasi_3.svg';
import i18n from 'src/locale';

type CarouselLoginViewProps = {
  onMobileSignIn: () => void;
  anonymousLogin: () => void;
};

const useStyles = makeStyles<Theme, CarouselLoginViewProps>(theme =>
  createStyles({
    root: {
      background: '#FFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    mb6: {
      marginBottom: theme.spacing(6),
    },
    mb8: {
      marginBottom: theme.spacing(8),
    },
    carousel: {
      marginTop: '10vh',
      marginBottom: theme.spacing(3),
      width: 'max-content',
    },
    title: {
      lineHeight: '33.6px',
      fontWeight: 600,
      fontSize: '28px',
    },
    subtitle: {
      fontWeight: 400,
      lineHeight: '19.6px',
      fontSize: '14px',
      padding: '0px 20px',
    },
    actionContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '5vh',
      alignItems: 'center',
      justifyContent: 'center',
      rowGap: 12,
    },
    button: {
      minWidth: '80vw',
    },
  }),
);

export const CarouselLoginView: React.FC<CarouselLoginViewProps> = props => {
  const {onMobileSignIn, anonymousLogin} = props;
  const style = useStyles({...props});

  return (
    <div className={style.root}>
      <div className={style.carousel}>
        <Carousel
          animation="slide"
          navButtonsAlwaysInvisible={true}
          IndicatorIcon={
            <div
              style={{
                height: '8px',
                width: '8px',
                borderRadius: '4px',
              }}
            />
          }
          indicatorIconButtonProps={{
            style: {
              backgroundColor: '#DECCFF',
              margin: '3px',
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              backgroundColor: '#7342CC',
              width: '20px',
              borderRadius: '20px',
            },
          }}>
          <div>
            <div className={style.mb8}>
              <Illustration />
            </div>
            <Typography
              variant="h2"
              className={`${style.title}`}
              component="span"
              gutterBottom={true}
              color="primary">
              <Typography variant="h2" className={style.title} component="span" color="primary">
                {i18n.t('Login.Layout.Carousel_Title_1_left')}
              </Typography>{' '}
              {i18n.t('Login.Layout.Carousel_Title_1_right')}
            </Typography>
            <Typography variant="h4" className={style.subtitle} component="p" color="textPrimary">
              {i18n.t('Login.Layout.Carousel_Subtitle_1a')}
            </Typography>
            <Typography variant="h4" className={style.subtitle} component="p" color="textPrimary">
              {i18n.t('Login.Layout.Carousel_Subtitle_1b')}
            </Typography>
          </div>

          <div>
            <div className={style.mb8}>
              <Illustration2 />
            </div>
            <Typography
              variant="h2"
              className={style.title}
              component="span"
              color="primary"
              gutterBottom={true}>
              <Typography variant="h2" className={style.title} component="span" color="primary">
                {i18n.t('Login.Layout.Carousel_Title_2_left')}
              </Typography>{' '}
              {i18n.t('Login.Layout.Carousel_Title_2_right')}
            </Typography>
            <Typography variant="h4" className={style.subtitle} component="p" color="textPrimary">
              {i18n.t('Login.Layout.Carousel_Subtitle_2')}
            </Typography>
          </div>

          <div>
            <div className={style.mb8}>
              <Illustration3 />
            </div>
            <Typography
              variant="h2"
              className={style.title}
              component="span"
              color="primary"
              gutterBottom={true}>
              {i18n.t('Login.Layout.Carousel_Title_3')}
            </Typography>
            <Typography variant="h4" className={style.subtitle} component="p" color="textPrimary">
              {i18n.t('Login.Layout.Carousel_Subtitle_3')}
            </Typography>
          </div>
        </Carousel>
      </div>
      <div className={style.actionContainer}>
        <Button
          className={style.button}
          variant="contained"
          color="primary"
          onClick={onMobileSignIn}>
          {i18n.t('Login.Layout.Btn_Signin')}
        </Button>
        <Button
          className={style.button}
          onClick={anonymousLogin}
          variant="outlined"
          color="secondary">
          {i18n.t('Mobile.button_label_sign_in')}
        </Button>
      </div>
    </div>
  );
};
