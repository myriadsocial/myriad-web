import React from 'react';

import {Link} from '@material-ui/core';

export const NearLink: React.FC = () => {
  return (
    <Link
      href="https://wallet.near.org"
      target="_blank"
      style={{color: 'rgb(255, 140, 0)', textDecoration: 'none'}}>
      NEAR Wallet
    </Link>
  );
};
