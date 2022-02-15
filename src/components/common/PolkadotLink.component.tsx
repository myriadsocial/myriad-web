import React from 'react';

import {Link} from '@material-ui/core';

export const PolkadotLink: React.FC = () => {
  return (
    <Link
      href="https://polkadot.js.org/extension"
      target="_blank"
      style={{color: 'rgb(255, 140, 0)', textDecoration: 'none'}}>
      Polkadot.js
    </Link>
  );
};
