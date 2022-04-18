import MyriadAPI from './base';

export enum WalletTypeEnum {
  POLKADOT = 'polkadot',
  TRUST = 'trust',
  METAMASK = 'metamask',
  COINBASE = 'coinbase',
  NEAR = 'near',
  SENDER = 'sender-wallet',
}

export enum NetworkTypeEnum {
  ETHEREUM = 'ethereum',
  POLKADOT = 'polkadot',
  BINANCE = 'binance',
  POLYGON = 'polygon',
  NEAR = 'near',
  MYRIAD = 'myriad',
  KUSAMA = 'kusama',
}

type LoginProps = {
  nonce: number;
  publicAddress: string;
  signature: string;
  walletType: WalletTypeEnum;
  networkType: NetworkTypeEnum;
};

type SignUpProps = {
  name: string;
  username: string;
  address: string;
  type: WalletTypeEnum;
  network: NetworkTypeEnum;
};

type SignUpResponseProps = {
  nonce: number;
};

type LoginResponseProps = {
  accessToken: string;
};

export const login = async (values: LoginProps): Promise<LoginResponseProps | null> => {
  try {
    const {data} = await MyriadAPI.request({
      url: '/login',
      method: 'POST',
      data: values,
    });

    return data;
  } catch (error) {
    console.log('[login][error]', {error});
    return null;
  }
};

export const signUp = async (values: SignUpProps): Promise<SignUpResponseProps | null> => {
  try {
    const {data} = await MyriadAPI.request({
      url: '/signup',
      method: 'POST',
      data: values,
    });

    return data;
  } catch (error) {
    console.log({error});
    return null;
  }
};
