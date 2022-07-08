import MyriadAPI from 'src/lib/api/base';

export const claimReference = async ({
  txFee,
  tippingContractId,
}: {
  txFee: string;
  tippingContractId?: string;
}) => {
  await MyriadAPI().request({
    url: '/claim-references',
    method: 'POST',
    data: {txFee, tippingContractId},
  });
};
