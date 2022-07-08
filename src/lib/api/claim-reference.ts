import {BaseErrorResponse} from './interfaces/error-response.interface';

import axios, {AxiosError} from 'axios';
import MyriadAPI from 'src/lib/api/base';

export const claimReference = async ({
  txFee,
  tippingContractId,
}: {
  txFee: string;
  tippingContractId?: string;
}) => {
  try {
    const {data} = await MyriadAPI().request({
      url: '/claim-references',
      method: 'POST',
      data: {txFee, tippingContractId},
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const {response} = error as AxiosError<BaseErrorResponse>;

      if (response.data.error.name === 'UnprocessableEntityError') {
        throw new Error(response.data.error.message);
      }
    }

    return null;
  }
};
