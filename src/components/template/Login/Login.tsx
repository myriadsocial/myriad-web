import React from 'react';
import Carousel from 'react-elastic-carousel';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './Login.styles';

import Purple from 'src/images/Bank_note_Isometric_1.svg';
import Yellow from 'src/images/Conversation__Isometric_1.svg';
import LogoImage from 'src/images/myriad-logo-black.svg';

type LoginProps = {
  children: React.ReactNode;
};

export const LoginLayout: React.FC<LoginProps> = ({children}) => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Grid container spacing={0}>
        <Grid item xs={7}>
          <div className={`${style.paper} ${style.flex}`}>
            <div className={style.logo}>
              <LogoImage />
            </div>

            <Typography variant="h1" className={style.title}>
              Social Media with <span className={style.titlePrimary}>no boundaries</span>
            </Typography>

            {children}
          </div>
        </Grid>
        <Grid item xs={5}>
          <div className={`${style.paper} ${style.background}`}>
            <div>
              <Yellow className={style.imageYellow} />
              <Purple className={style.imagePurple} />
            </div>
            <div className={style.carousel}>
              <Carousel isRTL={false} itemsToShow={1}>
                <div>
                  <div className={`${style.mb1}`}>
                    <Typography className={`${style.caption}`} component="span" color="textPrimary">
                      <Typography className={style.caption} component="span" color="primary">
                        Limitless
                      </Typography>{' '}
                      Conversation
                    </Typography>
                  </div>
                  <Typography className={style.subtitle} component="p" color="textPrimary">
                    No limitation on what you said in Myriad Fredom of Speech is Our Vision
                  </Typography>
                </div>
                <div>
                  <div className={`${style.mb1}`}>
                    <Typography className={style.caption} component="span" color="textPrimary">
                      <Typography className={style.caption} component="span" color="primary">
                        Monetize
                      </Typography>{' '}
                      your Idea
                    </Typography>
                  </div>
                  <Typography className={style.subtitle} component="p" color="textPrimary">
                    Speak what inside your mind and get a chance to earn coins
                  </Typography>
                </div>
              </Carousel>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
