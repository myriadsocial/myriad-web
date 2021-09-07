import React from 'react';

import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import DateFormat from '../../../../components/common/DateFormat';
import {PostSubHeaderProps} from './post-sub-header.interface';
import {useStyles} from './post-sub-header.style';

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
