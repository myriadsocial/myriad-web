import MyriadAPI from './base';
import { LoginResponseProps } from './ext-auth';

import axios from 'axios';

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
