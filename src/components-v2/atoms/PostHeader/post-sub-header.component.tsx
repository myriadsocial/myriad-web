import React from 'react';

import Typography from '@material-ui/core/Typography';
import {Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import DateFormat from '../../../components/common/DateFormat';
import {User} from '../../../interfaces/user';

type PostSubHeaderProps = {
  platform: string;
  date: Date;
  importer?: User;
};

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: 14,
      lineHeight: '18px',
      color: theme.palette.text.secondary,
    },
    circle: {
      margin: theme.spacing(0, 0.5),
      fontSize: 10,
    },
  }),
);

export const PostSubHeader: React.FC<PostSubHeaderProps> = ({date, platform, importer}) => {
  const style = useStyles();

  return (
    <Typography component="div" className={style.root}>
      <DateFormat date={date} />

      {importer && (
        <>
          <FiberManualRecordIcon className={style.circle} />
          {`Imported from ${platform} by `}
          <b>{importer.name}</b>
        </>
      )}
    </Typography>
  );
};
