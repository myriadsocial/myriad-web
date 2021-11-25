import React from 'react';

import Image from 'next/image';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '66vh',
      background: 'white',
      borderRadius: 8, //height: 320,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

type TimelineEmptyProps = {
  title: string;
  subtitle: string;
  iconPath: string;
  width: number;
  height: number;
  action?: React.ReactNode;
};

export const TimelineEmpty: React.FC<TimelineEmptyProps> = ({
  title,
  subtitle,
  iconPath,
  width,
  height,
  action,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Image src={iconPath} width={width} height={height} />
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
