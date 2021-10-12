import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',

      '& .MuiCard-root': {
        width: 445,
        height: 175,
        background:
          'linear-gradient(117.69deg, rgba(112, 112, 112, 0.2) 60.66%, rgba(203, 203, 203, 0) 114.57%)',
        backdropFilter: 'blur(24px)',
        /* Note: backdrop-filter has minimal browser support */
        borderColor: ' #696969',
        borderRadius: 8,
        marginRight: 32,
        padding: 8,
        '&:last-child': {
          marginRight: 0,
        },

        '& .MuiCardActions-root': {
          background: 'transparent',
          justifyContent: 'flex-end',
        },

        '& .MuiTypography-body1': {
          width: 312,
          fontSize: 16,
          fontWeight: 500,
          lineHeight: '22px',
        },

        '& .MuiTypography-gutterBottom': {
          marginBottom: 12,
        },
      },
    },
  }),
);

type LoginInfoComponentProps = {
  children?: React.ReactNode;
};

export const LoginInfoComponent: React.FC<LoginInfoComponentProps> = () => {
  const style = useStyles();

  return (
    <div className={style.root}>
      <Card>
        <CardContent>
          <Typography
            color="secondary"
            gutterBottom
            variant="h2"
            style={{fontSize: 24, fontWeight: 700, color: '#FFF'}}>
            Sky is the Limit
          </Typography>
          <Typography variant="body1" style={{color: '#FFF'}}>
            There is no post limitation on Myriad, Freedom of speech is our vision.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="medium" variant="contained" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
      <Card>
        <CardContent>
          <Typography
            color="secondary"
            gutterBottom
            variant="h2"
            style={{fontSize: 24, fontWeight: 700, color: '#FFF'}}>
            Monetize Your Idea
          </Typography>
          <Typography variant="body1" style={{color: '#FFF'}}>
            Post your best idea and get a chance to earn crypto tip.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="medium" variant="contained" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
