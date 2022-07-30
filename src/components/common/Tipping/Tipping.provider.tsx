import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Box, Button, Grid, Typography} from '@material-ui/core';

import {BN} from '@polkadot/util';

import SendTipContext, {HandleSendTip} from './Tipping.context';
import {TippingProviderProps, TippingOptions} from './Tipping.interface';
import {ButtonNotify} from './render/ButtonNotify';

import {Modal} from 'src/components/atoms/Modal';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {BalanceDetail} from 'src/interfaces/balance';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

const Tipping = dynamic(() => import('./Tipping'), {
  ssr: false,
});

const INITIAL_AMOUNT = new BN(-1);

export const TippingProvider: React.ComponentType<TippingProviderProps> = ({
  children,
  anonymous,
  sender,
  currentWallet,
  currentNetwork,
}) => {
  const [tipFormOpened, setOpenTipForm] = useState(false);
  const [options, setOptions] = useState<TippingOptions>();
  const [enabled, setTippingEnabled] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState<BalanceDetail>();
  const [currencyTipped, setTippingCurrency] = useState<BalanceDetail>();
  const [transactionUrl, setTransactionUrl] = useState<string>();
  const [amount, setAmount] = useState<BN>(INITIAL_AMOUNT);

  const {balanceDetails: balances, loading} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  useEffect(() => {
    setTippingEnabled(balances.length > 0 || anonymous);

    if (balances.length > 0) {
      setDefaultCurrency(balances[0]);
    }
  }, [balances, anonymous]);

  const tipping = useCallback<HandleSendTip>(
    options => {
      if (!anonymous) {
        setOptions(options);
        setOpenTipForm(true);
      }
    },
    [anonymous, currentWallet],
  );

  const handleCloseTipForm = useCallback(() => {
    setOpenTipForm(false);
  }, [options]);

  const handleSuccessTipping = useCallback(
    (currency: BalanceDetail, explorerURL: string, transactionHash: string, tipAmount: BN) => {
      setTransactionUrl(`${explorerURL}/${transactionHash}`);
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
      <SendTipContext.Provider value={{currentWallet, enabled, loading, send: tipping}}>
        {children}
      </SendTipContext.Provider>

      {!!options && !!sender && !!defaultCurrency && currentNetwork && (
        <Modal
          gutter="none"
          open={tipFormOpened}
          style={{}}
          onClose={handleCloseTipForm}
          title={i18n.t('Tipping.Modal_Main.Title')}
          subtitle={i18n.t('Tipping.Modal_Main.Subtitle')}>
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

      <PromptComponent
        icon="success"
        open={Boolean(currencyTipped)}
        onCancel={resetTippingStatus}
        title={i18n.t('Tipping.Prompt_Success.Title')}
        subtitle={
          <Typography component="div">
            {i18n.t('Tipping.Prompt_Success.Subtitle_1')}
            <Box fontWeight={400} display="inline">
              {options?.receiver.name ?? 'Unknown Myrian'}
            </Box>
            {i18n.t('Tipping.Prompt_Success.Subtitle_2')}
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
            {i18n.t('Tipping.Prompt_Success.Btn_Trx_Detail')}
          </Button>
          {currencyTipped &&
            (options &&
            'platform' in options.reference &&
            ['twitter', 'reddit'].includes(options.reference.platform) ? (
              <ButtonNotify
                reference={options.reference}
                currency={currencyTipped}
                amount={amount}
                receiver={options.receiver}
              />
            ) : (
              <Button size="small" variant="contained" color="primary" onClick={resetTippingStatus}>
                {i18n.t('Tipping.Prompt_Success.Btn_Return')}
              </Button>
            ))}
        </Grid>
      </PromptComponent>
    </>
  );
};
