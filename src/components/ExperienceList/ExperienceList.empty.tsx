import React from 'react';

import Link from 'next/link';

import {Button} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {Empty} from 'components/atoms/Empty';
import i18n from 'src/locale';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    empty: {
      padding: theme.spacing(2),
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
    button: {
      marginTop: '40px',
      marginBottom: '30px',
      [theme.breakpoints.down('xs')]: {
        width: 'auto',
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
      },
    },
  }),
);

export const EmptyExperience: React.FC = () => {
  const style = useStyles();

  return (
    <div className={style.empty}>
      <Empty
        title={i18n.t('Experience.List.Empty.Text_1')}
        subtitle={i18n.t('Experience.List.Empty.Text_2')}
        margin={true}
        height={true}
      />
      <Link href={'/experience/create'} passHref>
        <Button color="primary" variant="contained" size="small" className={style.button}>
          {i18n.t('Experience.List.Empty.Btn_Create')}
        </Button>
      </Link>
    </div>
  );
};
