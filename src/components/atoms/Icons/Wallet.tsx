import React from 'react';

import {SvgIcon, SvgIconProps} from '@material-ui/core';

import Polkadot24 from 'src/images/network/Polkadot24.svg';
import CoinbaseDisabled from 'src/images/wallet/coinbase-disabled.svg';
import MetamaskDisabled from 'src/images/wallet/metamask-disabled.svg';
import SenderWalletDisabled from 'src/images/wallet/sender-wallet-disabled.svg';
import SenderWallet from 'src/images/wallet/sender-wallet.svg';
import TrustDisabled from 'src/images/wallet/trust-disabled.svg';

export const PolkadotWalletIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={Polkadot24} viewBox="0 0 32 32" {...props} />
);

export const SenderWalletIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={SenderWallet} viewBox="0 0 32 32" {...props} />
);

export const SenderWalletDisabledIcon: React.FC<SvgIconProps> = props => (
  <SvgIcon component={SenderWalletDisabled} viewBox="0 0 32 32" {...props} />
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
