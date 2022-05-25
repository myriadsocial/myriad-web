import React from 'react';

import Link from 'next/link';

import {Button, Typography} from '@material-ui/core';
import {createStyles, makeStyles} from '@material-ui/core/styles';

import i18n from 'src/locale';

const useStyles = makeStyles(() =>
  createStyles({
    empty: {
      marginTop: 30,
      background: '#FFF',
      height: 335,
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
        {i18n.t('Experience.List.Empty.Text_1')}
      </Typography>
      <div style={{paddingLeft: 8, paddingRight: 8}}>
        <Typography className={style.subtitle} align="center" color="textSecondary" component="p">
          {i18n.t('Experience.List.Empty.Text_2')}
        </Typography>
      </div>
      <Link href={'/experience/create'}>
        <Button color="primary" variant="contained" size="small">
          {i18n.t('Experience.List.Empty.Btn_Create')}
        </Button>
      </Link>
    </div>
  );
};
