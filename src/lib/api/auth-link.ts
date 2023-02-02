import MyriadAPI from './base';

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

export const getLinkWithEmail = async (values: GetLinkWithEmailProps): Promise<string> => {
  const {data} = await MyriadAPI().request({
    url: '/authentication/otp/email',
    method: 'POST',
    data: {
      ...values,
    },
  });

  const {message} = data;

  return message;
};

export const loginWithLink = async (token: string, url?: string) => {
  const {data} = await MyriadAPI({apiURL: url}).request({
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
  const {data} = await MyriadAPI().request({
    url: '/authentication/signup/email',
    method: 'POST',
    data: {
      ...values,
    },
  });

  return data;
};
