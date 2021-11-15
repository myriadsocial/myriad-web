import React from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import {EmptyResultProps, EmptyContentEnum} from './EmptyResult.interfaces';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
      '& .MuiListItem-gutters': {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    empty: {
      background: '#FFF',
      height: '491px',
      width: '100%',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontWeight: 700,
      fontSize: '18px',
      marginBottom: '12px',
    },
    subtitle: {
      marginBottom: '40px',
      fontSize: '14px',
    },
  }),
);

export const EmptyResult: React.FC<EmptyResultProps> = ({emptyContent}) => {
  const classes = useStyles();

  return (
    <div className={classes.empty}>
      <Typography className={classes.title} component="p">
        Uh-oh!
      </Typography>
      <Typography className={classes.subtitle} color="textSecondary" component="p">
        No {emptyContent} found.
      </Typography>
      {emptyContent === EmptyContentEnum.EXPERIENCE ? (
        <Link href={'/experience'}>
          <Button color="primary" variant="contained" size="small">
            Create Experience
          </Button>
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
};
