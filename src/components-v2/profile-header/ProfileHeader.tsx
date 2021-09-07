import React from 'react';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BoxComponent} from '../atoms/Box';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 311,
      height: 110,

      '&::after': {
        content: '""',
        position: 'absolute',
        top: 35,
        right: 0,
        width: 8,
        height: 40,
        borderRadius: theme.spacing(1.25, 0, 0, 1.25),
        background: theme.palette.primary.main,
      },
    },
  }),
);

const ProfileHeader = (): JSX.Element => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <BoxComponent>
        <Typography>Aaron Ting</Typography>
        <Typography>@aaronting8</Typography>
      </BoxComponent>
    </div>
  );
};

export default ProfileHeader;
