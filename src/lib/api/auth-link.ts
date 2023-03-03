import { signIn } from 'next-auth/react';
import getConfig from 'next/config';

import MyriadAPI from './base';
import { LoginResponseProps } from './ext-auth';

import axios from 'axios';
import { NetworkIdEnum } from 'src/interfaces/network';
import { BlockchainPlatform } from 'src/interfaces/wallet';
import * as WalletAPI from 'src/lib/api/wallet';

type GetLinkWithEmailProps = {
  email: string;
  callbackURL: string;
};

export type SignupWithEmailProps = {
  username: string;
  name: string;
  email: string;
  callbackURL: string;
};

export const getLinkWithEmail = async (
  values: GetLinkWithEmailProps,
  apiURL?: string,
): Promise<string> => {
  if (apiURL) {
    const { data } = await axios({
      url: `${apiURL}/authentication/otp/email`,
      method: 'POST',
      data: {
        ...values,
      },
    });

    const { message } = data;

    return message;
  }

  const { data } = await MyriadAPI().request({
    url: '/authentication/otp/email',
    method: 'POST',
    data: {
      ...values,
    },
  });

  const { message } = data;

  return message;
};

export const loginWithLink = async (
  token: string,
): Promise<LoginResponseProps> => {
  const { data } = await MyriadAPI().request({
    url: '/authentication/login/otp',
    method: 'POST',
    data: {
      token,
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return data;
};

export const signUpWithEmail = async (values: SignupWithEmailProps) => {
  const { data } = await MyriadAPI().request({
    url: '/authentication/signup/email',
    method: 'POST',
    data: {
      ...values,
    },
  });

  return data;
};

export const updateSession = async session => {
  // hit the DB and return token with updated values
  // const session = await getSession(context);
  const publicRuntimeConfig = getConfig();
  if (session?.user?.id) {
    const { data: wallet } = await WalletAPI.getUserWallets(session?.user?.id);

    const blockchainPlatform =
      wallet[0]?.networkId === NetworkIdEnum.NEAR
        ? BlockchainPlatform.NEAR
        : BlockchainPlatform.SUBSTRATE;

    const newSession = {
      instanceURL:
        session.user.instanceURL ??
        publicRuntimeConfig.myriadAPIURL ??
        'https://api.myriad.social',
      networkType: session.user.networkType ?? wallet[0]?.networkId ?? '',
      blockchainPlatform:
        session.user.blockchainPlatform ?? blockchainPlatform ?? '',
      ...session.user,
    };

    signIn('updateSession', newSession);
  }

  return true;
};
