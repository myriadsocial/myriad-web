import React from 'react';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '66vh',
      background: 'white',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
  }),
);

type TimelineEmptyProps = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export const TimelineEmpty: React.FC<TimelineEmptyProps> = ({title, subtitle, action}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div style={{marginBottom: 12}}>
        <Typography style={{fontWeight: 'bold', fontSize: 18}}>{title}</Typography>
      </div>
      <div style={{marginBottom: 24}}>
        <Typography style={{fontWeight: 400, fontSize: 14}}>{subtitle}</Typography>
      </div>
      {action ? action : <></>}
    </div>
  );
};
