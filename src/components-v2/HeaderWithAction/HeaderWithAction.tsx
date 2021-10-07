import React from 'react';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {useStyles, HeaderWithActionProps} from '.';
import {experienceSortOptions} from '../Timeline/default';
import {DropdownMenu} from '../atoms/DropdownMenu/';

export const HeaderWithAction: React.FC<HeaderWithActionProps> = props => {
  const {actionText} = props;
  const classes = useStyles();

  const handleSortChanged = (sort: string) => {
    // code
  };

  return (
    <div className={classes.root}>
      <Typography variant={'caption'} color={'primary'}>
        <Link href={'/experience/create'} className={classes.actionText}>
          {actionText}
        </Link>
      </Typography>
      <DropdownMenu
        title={'Sort by'}
        options={experienceSortOptions}
        onChange={handleSortChanged}
      />
    </div>
  );
};
