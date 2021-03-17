import React from 'react';

import Box from '@material-ui/core/Box';

const BoxComponent = ({ children }) => {
  return (
    <Box bgcolor="text.primary" color="background.paper" p={2}>
      {children}
    </Box>
  );
};

export default BoxComponent;
