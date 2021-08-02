import React from 'react';

import Typography from '@material-ui/core/Typography';
import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

interface ListHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: theme.spacing(1),
    },
    text: {
      fontWeight: 700,
      fontSize: 16,
    },
  }),
);

export const ListHeaderComponent: React.FC<ListHeaderProps> = props => {
  const {children, title} = props;
  const style = useStyles();

  return (
    <div className={style.root}>
      <Typography variant="caption" className={style.text}>
        {title}
      </Typography>
      {children}
    </div>
  );
};
