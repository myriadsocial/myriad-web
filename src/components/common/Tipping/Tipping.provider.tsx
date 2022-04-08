import React, {useCallback, useEffect, useState} from 'react';

import dynamic from 'next/dynamic';

import {Box, Button, Grid, Typography} from '@material-ui/core';

import {BN} from '@polkadot/util';

import SendTipContext, {HandleSendTip} from './Tipping.context';
import {TippingProviderProps, TippingOptions} from './Tipping.interface';
import {ButtonNotify} from './render/ButtonNotify';

import {PromptComponent as MobilePromptComponent} from 'src/components/Mobile/PromptDrawer/Prompt';
import {Modal} from 'src/components/atoms/Modal';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {BalanceDetail} from 'src/interfaces/balance';

const Tipping = dynamic(() => import('./Tipping'), {
  ssr: false,
});

const INITIAL_AMOUNT = new BN(-1);

export const TippingProvider: React.ComponentType<TippingProviderProps> = ({
  children,
  anonymous,
  sender,
  balances,
  currentWallet,
}) => {
  const [tipFormOpened, setOpenTipForm] = useState(false);
  const [tipInfoOpened, setTipInfoOpened] = useState(false);
  const [options, setOptions] = useState<TippingOptions>();
  const [enabled, setTippingEnabled] = useState(false);
  const [promptFailedTip, setPromptFailedTip] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState<BalanceDetail>();
  const [currencyTipped, setTippingCurrency] = useState<BalanceDetail>();
  const [transactionUrl, setTransactionUrl] = useState<string>();
  const [amount, setAmount] = useState<BN>(INITIAL_AMOUNT);

  useEffect(() => {
    setTippingEnabled(balances.length > 0);

    if (balances.length > 0) {
      setDefaultCurrency(balances[0]);
    }
  }, [balances]);

  const tipping = useCallback<HandleSendTip>(
    options => {
      setOptions(options);

      if (anonymous) setTipInfoOpened(true);
      else setOpenTipForm(true);
    },
    [anonymous, currentWallet],
  );

  const handleCloseTipForm = useCallback(() => {
    setOpenTipForm(false);
  }, [options]);

  const handleCloseTipInfo = useCallback(() => {
    setTipInfoOpened(false);
  }, [options]);

  const handleSuccessTipping = useCallback(
    (currency: BalanceDetail, transactionHash: string, tipAmount: BN) => {
      if (currency?.network.explorerURL) {
        setTransactionUrl(`${currency.network.explorerURL}/${transactionHash}`);
      }
      setAmount(tipAmount);
      setTippingCurrency(currency);
      handleCloseTipForm();
    },
    [],
  );

  const resetTippingStatus = useCallback(() => {
    setTippingCurrency(undefined);
  }, []);

  return (
    <>
      <SendTipContext.Provider value={{enabled, send: tipping}}>{children}</SendTipContext.Provider>

      {!!options && !!sender && !!defaultCurrency && currentNetwork && (
        <Modal
          gutter="none"
          open={tipFormOpened}
          style={{}}
          onClose={handleCloseTipForm}
          title="Send Tip"
          subtitle="Finding this post is insightful? Send a tip!">
          <Tipping
            defaultCurrency={defaultCurrency}
            currentNetwork={currentNetwork}
            balances={balances}
            sender={sender}
            onSuccess={handleSuccessTipping}
            {...options}
          />
        </Modal>
      )}

      <MobilePromptComponent
        title={'Send Tips'}
        subtitle={'Appreciate others posts by sending tips with stable cryptocurrency'}
        open={tipInfoOpened}
        onCancel={handleCloseTipInfo}
      />

      <PromptComponent
        icon="success"
        open={Boolean(currencyTipped)}
        onCancel={resetTippingStatus}
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
            href={transactionUrl ?? 'https://myriad.social'}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            variant="outlined"
            color="secondary">
            Transaction details
          </Button>
          {options && 'platform' in options.reference && currencyTipped ? (
            <ButtonNotify
              reference={options.reference}
              currency={currencyTipped}
              amount={amount}
              receiver={options.receiver}
            />
          ) : (
            <Button size="small" variant="contained" color="primary" onClick={resetTippingStatus}>
              Return
            </Button>
          )}
        </Grid>
      </PromptComponent>
      <PromptComponent
        icon="danger"
        open={promptFailedTip}
        onCancel={resetTippingStatus}
        title="Send tip could not be processed"
        subtitle={
          <Typography component="div">
            {`This user doesn't have ${currentWallet?.toUpperCase()} wallet account to receive the tips`}
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setPromptFailedTip(false);
            }}>
            OK
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
