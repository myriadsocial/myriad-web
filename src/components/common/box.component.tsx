import React from 'react';

import Box from '@material-ui/core/Box';

type Props = {
  children: React.ReactNode;
};

const BoxComponent = ({ children }: Props) => {
  return (
    <Box bgcolor="text.primary" color="background.paper" p={2}>
      {children}
    </Box>
  );
};

export default BoxComponent;
