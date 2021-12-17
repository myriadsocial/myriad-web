import {ArrowDownIcon} from '@heroicons/react/outline';

import React from 'react';

import {Button, SvgIcon} from '@material-ui/core';

type Props = {
  handleAction: () => void;
};

export const LoadMore: React.FC<Props> = props => {
  const {handleAction} = props;
  return (
    <Button
      onClick={handleAction}
      style={{position: 'fixed', bottom: '30px', left: '43%'}}
      startIcon={<SvgIcon component={ArrowDownIcon} viewBox="0 0 24 24" />}
      variant="outlined"
      size="small"
      color="secondary">
      Load more
    </Button>
  );
};
