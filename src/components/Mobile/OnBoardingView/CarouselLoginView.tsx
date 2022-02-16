import React from 'react';
import Carousel from 'react-elastic-carousel';

import {Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import Illustration from 'src/images/illustration/amico.svg';
import Illustration3 from 'src/images/illustration/gdpr_-_amico.svg';
import Illustration2 from 'src/images/illustration/money_income_-_amico.svg';
import i18n from 'src/locale';

type CarouselLoginViewProps = {
  height: number;
  onSignIn: () => void;
};

const useStyles = makeStyles<Theme, CarouselLoginViewProps>(theme =>
  createStyles({
    root: {
      position: 'relative',
      background: '#FFF',
      height: '100vh',
      paddingTop: 60,
      textAlign: 'center',
    },
    mb1: {
      marginBottom: theme.spacing(1),
    },
    mb6: {
      marginBottom: theme.spacing(6),
    },
    mb8: {
      marginBottom: theme.spacing(8),
    },
    carousel: {
      width: '100vw',
      '& .rec.rec-arrow': {
        visibility: 'hidden',
        display: 'none',
      },
      '& .rec.rec-dot': {
        background: '#DECCFF',
        boxShadow: 'none',
        width: '12px',
        height: '12px',
      },
      '& .rec.rec-dot.jJKuoL': {
        width: '28px',
        background: theme.palette.primary.main,
        borderRadius: 20,
      },
      '& .rec.rec-dot:focus': {
        background: theme.palette.primary.main,
        width: '28px',
        borderRadius: 20,
      },
      '& .rec-carousel-wrapper': {
        alignItems: 'center',
      },
    },
    title: {
      lineHeight: '33.6px',
      fontWeight: 600,
      fontSize: '28px',
    },
    subtitle: {
      fontWeight: theme.typography.fontWeightRegular,
      lineHeight: '19.6px',
      fontSize: '14px',
    },
    button: {
      position: 'absolute',
      width: '100%',
      bottom: props => (props.height < 700 ? '20px' : '80px'),
    },
  }),
);

export const CarouselLoginView: React.FC<CarouselLoginViewProps> = props => {
  const {onSignIn} = props;
  const style = useStyles({...props});

  return (
    <div className={style.root}>
      <Grid container direction="column" justifyContent="center" alignContent="center">
        <Grid item xs={12} className={style.mb6}>
          <div className={style.carousel}>
            <Carousel isRTL={false} itemsToShow={1}>
              <div>
                <div className={style.mb8}>
                  <Illustration />
                </div>
                <div className={`${style.mb1}`}>
                  <Typography
                    variant="h2"
                    className={`${style.title}`}
                    component="span"
                    color="primary">
                    <Typography
                      variant="h2"
                      className={style.title}
                      component="span"
                      color="primary">
                      {i18n.t('Login.Layout.Carousel_Title_1_left')}
                    </Typography>{' '}
                    {i18n.t('Login.Layout.Carousel_Title_1_right')}
                  </Typography>
                </div>
                <Typography
                  variant="h4"
                  className={style.subtitle}
                  component="p"
                  color="textPrimary">
                  {i18n.t('Login.Layout.Carousel_Subtitle_1a')}
                </Typography>
                <Typography
                  variant="h4"
                  className={style.subtitle}
                  component="p"
                  color="textPrimary">
                  {i18n.t('Login.Layout.Carousel_Subtitle_1b')}
                </Typography>
              </div>

              <div>
                <div className={style.mb8}>
                  <Illustration2 />
                </div>
                <div className={`${style.mb1}`}>
                  <Typography variant="h2" className={style.title} component="span" color="primary">
                    <Typography
                      variant="h2"
                      className={style.title}
                      component="span"
                      color="primary">
                      {i18n.t('Login.Layout.Carousel_Title_2_left')}
                    </Typography>{' '}
                    {i18n.t('Login.Layout.Carousel_Title_2_right')}
                  </Typography>
                </div>
                <Typography
                  variant="h4"
                  className={style.subtitle}
                  component="p"
                  color="textPrimary">
                  {i18n.t('Login.Layout.Carousel_Subtitle_2')}
                </Typography>
              </div>

              <div>
                <div className={style.mb8}>
                  <Illustration3 />
                </div>
                <div className={`${style.mb1}`}>
                  <Typography variant="h2" className={style.title} component="span" color="primary">
                    Keep secure
                  </Typography>
                </div>
                <Typography
                  variant="h4"
                  className={style.subtitle}
                  component="p"
                  color="textPrimary">
                  Decentralization provide safety and no personal data collected.
                </Typography>
              </div>
            </Carousel>
          </div>
        </Grid>
      </Grid>
      <div className={style.button}>
        <Button variant="contained" color="primary" onClick={onSignIn}>
          Sign in
        </Button>
      </div>
    </div>
  );
};
