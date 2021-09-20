import React from 'react';

import Button from '@material-ui/core/Button';

import {useStyles} from './prompt.style';

export const ButtonComponent: React.FC = () => {
  const style = useStyles();

  return (
    <div className={`${style['flex-center']}`}>
      <Button size="small" variant="outlined" color="secondary">
        No, let me rethink
      </Button>
      <Button size="small" variant="contained" color="primary">
        Yes, proceed to delete
      </Button>
    </div>
  );
};
