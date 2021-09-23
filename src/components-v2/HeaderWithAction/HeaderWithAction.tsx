import React from 'react';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {useStyles, HeaderWithActionProps} from '.';
import {experienceFilterOptions} from '../Timeline/default';
import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu/';

export const HeaderWithAction: React.FC<HeaderWithActionProps> = props => {
  const {actionText} = props;
  const classes = useStyles();

  const handleAction = () => {
    console.log('action done!');
  };

  return (
    <div className={classes.root}>
      <Typography variant={'caption'} color={'primary'}>
        <Link className={classes.actionText} component="button" onClick={handleAction}>
          {actionText}
        </Link>
      </Typography>
      <FilterDropdownMenu title={'Filter by'} options={experienceFilterOptions} />
    </div>
  );
};
