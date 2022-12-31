import MyriadAPI from './base';

import {NetworkIdEnum} from 'src/interfaces/network';
import {WalletTypeEnum} from 'src/interfaces/wallet';

type LoginProps = {
  nonce: number;
  publicAddress: string;
  signature: string;
  walletType: WalletTypeEnum;
  networkType: NetworkIdEnum;
};

type SignUpProps = {
  name: string;
  username: string;
  address: string;
  network: NetworkIdEnum;
};

type SignUpResponseProps = {
  nonce: number;
};

type LoginResponseProps = {
  accessToken: string;
};

export const login = async (values: LoginProps): Promise<LoginResponseProps | null> => {
  try {
    const {data} = await MyriadAPI().request({
      url: '/authentication/login/wallet',
      method: 'POST',
      data: values,
    });

    return data;
  } catch (error) {
    return null;
  }
};

export const signUp = async (values: SignUpProps): Promise<SignUpResponseProps | null> => {
  try {
    const {data} = await MyriadAPI().request({
      url: '/authentication/signup/wallet',
      method: 'POST',
      data: values,
    });

    return data;
  } catch (error) {
    console.log({error});
    return null;
  }
};
