import React from 'react';

import {SvgIcon, SvgIconProps} from '@material-ui/core';

import Near24 from 'src/images/network/Near24.svg';
import Polkadot24 from 'src/images/network/Polkadot24.svg';
import Ethereum from 'src/images/network/ethereum-disabled.svg';
import Near from 'src/images/network/near.svg';
import Polkadot from 'src/images/network/polkadot.svg';
import PolygonDisabled from 'src/images/network/polygon-disabled.svg';

export const EthereumNetworkIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Ethereum} viewBox="0 0 32 32" {...props} />
);

export const NearNetworkIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Near} viewBox="0 0 32 32" {...props} />
);

export const PolkadotNetworkIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Polkadot} viewBox="0 0 32 32" {...props} />
);

export const PolygonNetworkDisabledIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={PolygonDisabled} viewBox="0 0 32 32" {...props} />
);

export const NearNetworkIcon24: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Near24} viewBox="0 0 24 24" {...props} />
);

export const NewPolkadotNetworkIcon24: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Polkadot24} viewBox="0 0 24 24" {...props} />
);
