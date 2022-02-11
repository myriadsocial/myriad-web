import React from 'react';

import {SvgIcon, SvgIconProps} from '@material-ui/core';

import Polkadot from 'src/images/network/polkadot.svg';
import CoinbaseDisabled from 'src/images/wallet/coinbase-disabled.svg';
import MetamaskDisabled from 'src/images/wallet/metamask-disabled.svg';
import TrustDisabled from 'src/images/wallet/trust-disabled.svg';

export const PolkadotWalletIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Polkadot} viewBox="0 0 32 32" {...props} />
);

export const CoinbaseWalletisabledIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={CoinbaseDisabled} viewBox="0 0 32 32" {...props} />
);

export const MetamaskWalletDisabledIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={MetamaskDisabled} viewBox="0 0 32 32" {...props} />
);

export const TrustWalletDisabledIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={TrustDisabled} viewBox="0 0 32 32" {...props} />
);
