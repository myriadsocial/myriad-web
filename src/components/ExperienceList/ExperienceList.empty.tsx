import React from 'react';

import Link from 'next/link';

import {Button, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
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

export const EmptyExperience: React.FC = () => {
  const style = useStyles();

  return (
    <div className={style.empty}>
      <Typography className={style.title} component="p">
        Uh-oh!
      </Typography>
      <div style={{paddingLeft: 8, paddingRight: 8}}>
        <Typography className={style.subtitle} align="center" color="textSecondary" component="p">
          You haven't created any experience yet. Experience allows you to customize various tags
          and people to be shown in your timeline.
        </Typography>
      </div>
      <Link href={'/experience/create'}>
        <Button color="primary" variant="contained" size="small">
          Create Experience
        </Button>
      </Link>
    </div>
  );
};
