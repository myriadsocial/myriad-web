import React, {useCallback, useEffect, useState} from 'react';

import dynamic from 'next/dynamic';

import {Box, Button, Grid, Typography} from '@material-ui/core';

import SendTipContext, {HandleSendTip} from './Tipping.context';
import {TippingProviderProps, TippingOptions} from './Tipping.interface';

import {PromptComponent as MobilePromptComponent} from 'src/components/Mobile/PromptDrawer/Prompt';
import {Modal} from 'src/components/atoms/Modal';
import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {BalanceDetail} from 'src/interfaces/balance';

const Tipping = dynamic(() => import('./Tipping'), {
  ssr: false,
});

export const TippingProvider: React.ComponentType<TippingProviderProps> = ({
  children,
  anonymous,
  sender,
  balances,
}) => {
  const [tipFormOpened, setOpenTipForm] = useState(false);
  const [tipInfoOpened, setTipInfoOpened] = useState(false);
  const [options, setOptions] = useState<TippingOptions>();
  const [enabled, setTippingEnabled] = useState(false);
  const [currencyTipped, setTippingCurrency] = useState<BalanceDetail>();

  useEffect(() => {
    setTippingEnabled(balances.length > 0);
  }, [balances]);

  const tipping = useCallback<HandleSendTip>(
    options => {
      setOptions(options);

      if (anonymous) {
        setTipInfoOpened(true);
      } else {
        setOpenTipForm(true);
      }
    },
    [anonymous],
  );

  const handleCloseTipForm = useCallback(() => {
    setOpenTipForm(false);
  }, [options]);

  const handleCloseTipInfo = useCallback(() => {
    setTipInfoOpened(false);
  }, [options]);

  const handleSuccessTipping = useCallback((currency: BalanceDetail) => {
    setTippingCurrency(currency);

    handleCloseTipForm();
  }, []);

  const resetTippingStatus = useCallback(() => {
    setTippingCurrency(undefined);
  }, []);

  return (
    <>
      <SendTipContext.Provider value={{enabled, send: tipping}}>{children}</SendTipContext.Provider>

      {options && sender && (
        <Modal
          gutter="none"
          open={tipFormOpened}
          onClose={handleCloseTipForm}
          title="Send Tip"
          subtitle="Finding this post is insightful? Send a tip!">
          <Tipping
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
        title="Success"
        subtitle={
          <Typography component="div">
            Tip to&nbsp;
            <Box fontWeight={400} display="inline">
              {options?.receiver.name ?? 'Unknown Myrian'}
            </Box>
            &nbsp;sent successfully
          </Typography>
        }>
        <Grid container justifyContent="center">
          <a
            target="_blank"
            style={{textDecoration: 'none'}}
            href={currencyTipped?.explorerURL ?? 'https://myriad.social'}
            rel="noopener noreferrer">
            <Button style={{marginRight: '12px'}} size="small" variant="outlined" color="secondary">
              Transaction details
            </Button>
          </a>
          <Button size="small" variant="contained" color="primary" onClick={resetTippingStatus}>
            Return
          </Button>
        </Grid>
      </PromptComponent>
    </>
  );
};
