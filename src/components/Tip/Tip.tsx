import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './tip.style';

import {NearNetworkIcon24, MyriadCircleIcon} from 'src/components/atoms/Icons';

export const Tip: React.FC = () => {
  const style = useStyles();

  const handleClaim = () => {
    // PUT CODE HERE
  };

  return (
    <>
      <ListItem alignItems="center" className={style.listItem}>
        <ListItemAvatar>
          <NearNetworkIcon24 width={'24px'} height={'24px'} />
        </ListItemAvatar>
        <ListItemText>
          <Typography variant="h6" component="span" color="textPrimary">
            {'NEAR'}
          </Typography>
        </ListItemText>
        <div className={style.secondaryAction}>
          <Button
            className={style.button}
            size="small"
            color="primary"
            variant="text"
            onClick={handleClaim}>
            Claim all
          </Button>
        </div>
      </ListItem>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
        {/* MAPING ARRAY OF DATA CLAIM */}
        <Grid item xs={6}>
          <div className={style.content}>
            <div className={style.flex}>
              <div>
                <MyriadCircleIcon width={'32px'} height={'32px'} />
                <Typography component="p" variant="h5">
                  {'MYRIA'}
                </Typography>
              </div>
              <Button
                size="small"
                className={style.buttonClaim}
                color="primary"
                variant="contained">
                Claim
              </Button>
            </div>
            <div className={style.text}>
              <Typography variant="h5" component="p" color="textPrimary">
                {'120.12345678'}
              </Typography>
              <Typography variant="subtitle2" component="p" color="textSecondary">
                USD {'150.24'}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={style.content}>
            <div className={style.flex}>
              <div>
                <MyriadCircleIcon width={'32px'} height={'32px'} />
                <Typography component="p" variant="h5">
                  MYRIA
                </Typography>
              </div>
              <Button
                size="small"
                className={style.buttonClaim}
                color="primary"
                variant="contained">
                Claim
              </Button>
            </div>
            <div className={style.text}>
              <Typography variant="h5" component="p" color="textPrimary">
                120.12345678
              </Typography>
              <Typography variant="subtitle2" component="p" color="textSecondary">
                USD 150.24
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={style.content}>
            <div className={style.flex}>
              <div>
                <MyriadCircleIcon width={'32px'} height={'32px'} />

                <Typography component="p" variant="h5">
                  MYRIA
                </Typography>
              </div>
              <Button
                size="small"
                className={style.buttonClaim}
                color="primary"
                variant="contained">
                Claim
              </Button>
            </div>
            <div className={style.text}>
              <Typography variant="h5" component="p" color="textPrimary">
                120.12345678
              </Typography>
              <Typography variant="subtitle2" component="p" color="textSecondary">
                USD 150.24
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};
