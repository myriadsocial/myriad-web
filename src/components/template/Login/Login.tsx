import React from 'react';
import Carousel, {CarouselProps} from 'react-material-ui-carousel';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './Login.styles';

import {settingLanguageOptions} from 'src/components/Settings/default';
import {DropdownMenu} from 'src/components/atoms/DropdownMenu';
import {MyriadFullIcon} from 'src/components/atoms/Icons';
import {CookieConsent} from 'src/components/common/CookieConsent';
import {useLanguage} from 'src/hooks/use-language.hook';
import Purple from 'src/images/illustration/Bank_note_Isometric_1.svg';
import Yellow from 'src/images/illustration/Conversation__Isometric_1.svg';
import {LanguageSettingType} from 'src/interfaces/setting';
import i18n from 'src/locale';

type LoginProps = {
  children: React.ReactNode;
};

export const LoginLayout: React.FC<LoginProps> = ({children}) => {
  const style = useStyles();
  const {language, changeLanguage} = useLanguage();

  const settingsCarousel: CarouselProps = {
    autoPlay: true,
    animation: 'slide',
    indicators: true,
    timeout: 500,
    navButtonsAlwaysVisible: false,
    navButtonsAlwaysInvisible: true,
    indicatorContainerProps: {style: {textAlign: 'left'}},
    indicatorIconButtonProps: {className: style.carouselIndicatior},
    activeIndicatorIconButtonProps: {className: style.carouselActiveIndicatior},
    cycleNavigation: true,
    fullHeightHover: true,
    swipe: true,
  };

  return (
    <div className={style.root}>
      <Grid container spacing={0}>
        <Grid item xs={7}>
          <div className={`${style.paper} ${style.flex}`}>
            <div className={style.logo}>
              <MyriadFullIcon />
            </div>

            <Typography variant="h5" component="h1" className={style.title}>
              {i18n.t('Login.Layout.Title_left')}{' '}
              <span className={style.titlePrimary}>{i18n.t('Login.Layout.Title_right')}</span>
            </Typography>
            {children}
            <div>
              <DropdownMenu<LanguageSettingType>
                title=""
                selected={language}
                options={settingLanguageOptions}
                onChange={changeLanguage}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={5}>
          <div className={`${style.paper} ${style.background}`}>
            <div>
              <Yellow className={style.imageYellow} />
              <Purple className={style.imagePurple} />
            </div>
            <div className={style.carousel}>
              {/* TODO: FIX MARGIN BETWEEN CIRCLE INDICATOR CAROUSEL */}
              <Carousel {...settingsCarousel}>
                <div>
                  <div className={`${style.mb1}`}>
                    <Typography
                      variant="h2"
                      className={`${style.caption}`}
                      component="span"
                      color="textPrimary">
                      <Typography
                        variant="h2"
                        className={style.caption}
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
                  <div className={`${style.mb1}`}>
                    <Typography
                      variant="h2"
                      className={style.caption}
                      component="span"
                      color="textPrimary">
                      <Typography
                        variant="h2"
                        className={style.caption}
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
              </Carousel>
            </div>
          </div>
        </Grid>
      </Grid>

      <CookieConsent />
    </div>
  );
};
