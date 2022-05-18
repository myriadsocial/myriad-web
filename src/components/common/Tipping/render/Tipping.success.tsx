import React, {useEffect, useState} from 'react';

import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {Box, Button, Grid, Typography} from '@material-ui/core';

import {ButtonNotify} from './ButtonNotify';

import localforage from 'localforage';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {Currency} from 'src/interfaces/currency';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {SimpleSendTipProps, TransactionProps} from 'src/interfaces/transaction';
import {User} from 'src/interfaces/user';
import {storeTransaction} from 'src/lib/api/transaction';

export type TippingSuccessProps = {
  receiver: User;
  currency: Currency;
  amount: string;
};

export type TippingStorageProps = {
  attributes: TransactionProps | SimpleSendTipProps;
  receiver: User | People;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
  amount: number;
};

export const TIPPING_STORAGE_KEY = '@Tipping_Storage_Key';
const {publicRuntimeConfig} = getConfig();

export const TippingSuccess = () => {
  const router = useRouter();
  const {openToasterSnack} = useToasterSnackHook();
  const [trxHash, setTrxHash] = useState<string>();
  const [options, setOptions] = useState<TippingStorageProps>();
  const [openPrompt, setOpenPrompt] = useState(false);

  useEffect(() => {
    const url = new URL(router.pathname, publicRuntimeConfig.appAuthURL);
    const transactionHashes = router.query.transactionHashes as string | null;

    if (transactionHashes) {
      const search = router.query.q;

      if (search && !Array.isArray(search)) {
        url.searchParams.set('q', search);
      }

      if (search && Array.isArray(search)) {
        search.forEach(keyword => {
          url.searchParams.append('q', keyword);
        });
      }

      if (transactionHashes) {
        setTrxHash(transactionHashes);
        router.replace(url, undefined, {shallow: true});
        setOpenPrompt(true);
        processTips(transactionHashes);
      }

      const errorCode = router.query.errorCode as string | null;
      const errorMessage = router.query.errorMessage as string | null;
      if (errorCode && errorMessage) {
        openToasterSnack({
          variant: 'warning',
          message: 'Transaction rejected by user',
        });

        router.replace(url, undefined, {shallow: true});
      }
    }
  }, [router.query]);

  const processTips = async (transactionHashes: string) => {
    const attributesOptions = (await localforage.getItem(
      TIPPING_STORAGE_KEY,
    )) as TippingStorageProps | null;
    if (attributesOptions) {
      setOptions(attributesOptions);
      let simpleSendTip: SimpleSendTipProps | null;
      if ('currency' in attributesOptions.attributes) {
        simpleSendTip = attributesOptions?.attributes;
        if (simpleSendTip) {
          await storeTransaction({
            from: attributesOptions.attributes.from,
            to: simpleSendTip.walletDetail.referenceId,
            amount: attributesOptions.amount,
            currencyId: simpleSendTip.currency.id,
            hash: transactionHashes,
          });
        }
      }
      await localforage.removeItem(TIPPING_STORAGE_KEY);
    }
  };

  const onClosePrompt = () => {
    setOpenPrompt(false);
  };

  return (
    <>
      {options && (
        <PromptComponent
          icon="success"
          open={openPrompt}
          onCancel={onClosePrompt}
          title="Tip sent!"
          subtitle={
            <Typography component="div">
              Tip to&nbsp;
              <Box fontWeight={400} display="inline">
                {options?.receiver.name ?? 'Unknown Myrian'}
              </Box>
              &nbsp;sent successfully
            </Typography>
          }>
          <Grid container justifyContent="space-around">
            <Button
              href={`${
                'currency' in options.attributes
                  ? options?.attributes.currency.network.explorerURL + `/transactions/${trxHash}`
                  : null
              }`}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="outlined"
              color="secondary">
              Transaction details
            </Button>
            {options &&
            'platform' in options.reference &&
            'currency' in options.attributes &&
            ['twitter', 'reddit'].includes(options.reference.platform) ? (
              <ButtonNotify
                reference={options.reference}
                currency={options.attributes.currency}
                amount={options.attributes.amount}
                receiver={options.receiver}
              />
            ) : (
              <Button size="small" variant="contained" color="primary" onClick={onClosePrompt}>
                Return
              </Button>
            )}
          </Grid>
        </PromptComponent>
      )}
    </>
  );
};
