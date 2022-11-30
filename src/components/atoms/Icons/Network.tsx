import React from 'react';

import {SvgIcon, SvgIconProps} from '@material-ui/core';

import Kusama from 'src/images/network/Kusama.svg';
import Near24 from 'src/images/network/Near24.svg';
import Polkadot24 from 'src/images/network/Polkadot24.svg';
import Debio from 'src/images/network/debio.svg';
import Ethereum from 'src/images/network/ethereum-disabled.svg';
import Near from 'src/images/network/near.svg';
import PolygonDisabled from 'src/images/network/polygon-disabled.svg';

export const EthereumNetworkIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Ethereum} viewBox="0 0 32 32" {...props} />
);

export const NearNetworkIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Near} viewBox="0 0 32 32" {...props} />
);

export const PolygonNetworkDisabledIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={PolygonDisabled} viewBox="0 0 32 32" {...props} />
);

export const NearNetworkIcon24: React.FC<SvgIconProps> = props => {
  return (
    <SvgIcon
      component={Near24}
      viewBox="0 0 24 24"
      {...props}
      style={{width: props.width, height: props.height}}
    />
  );
};

export const PolkadotNetworkIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon
    component={Polkadot24}
    viewBox="0 0 24 24"
    {...props}
    style={{width: props.width, height: props.height}}
  />
);

export const KusamaNetworkIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Kusama} viewBox="0 0 24 24" {...props} />
);

export const DebioNetworkIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon
    component={Debio}
    viewBox="0 0 40 40"
    {...props}
    style={{width: props.width, height: props.height}}
  />
);
