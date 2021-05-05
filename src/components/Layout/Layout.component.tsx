import React, { useEffect } from 'react';

import { User } from 'next-auth';

import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';

import { cryptoWaitReady } from '@polkadot/util-crypto';

import { enableExtension } from '../../helpers/extension';
import { getBalance } from '../../helpers/polkadotApi';
import ShowIf from '../common/show-if.component';
import { ExperienceComponent } from '../experience/experience.component';
import UserDetail from '../user/user.component';
import { Wallet } from '../wallet/wallet.component';
import { useMyriadAccount } from '../wallet/wallet.context';
import { useStyles } from './layout.style';
import { useLayout } from './use-layout.hook';

import { WithAdditionalParams } from 'next-auth/_utils';

type Props = {
  children: React.ReactNode;
  user: WithAdditionalParams<User>;
};

const LayoutComponent = ({ children, user }: Props) => {
  const style = useStyles();

  const { dispatch: myriadAccountDispatch } = useMyriadAccount();
  const { setting, changeSetting } = useLayout();

  const userId = user.address as string;

  useEffect(() => {
    // fetch for address
    (async () => {
      await cryptoWaitReady();
      const allAccounts = await enableExtension();
      // by default, only read the first account address
      if (!allAccounts) {
        console.log('no accounts retrieved!');
        throw new Error('no extension/account detected on browser!');
      }
      const currentAddress = user.address;
      const freeBalance = await getBalance(currentAddress);
      //console.log(`the address is: ${currentAddress}`);
      //console.log(`the balance is: ${freeBalance}`);
      addAddress('address', String(currentAddress));
      // divide freeBalance by 100
      if (freeBalance) {
        storeBalance('freeBalance', freeBalance / 100);
      }
    })();
  }, []);

  const storeBalance = (key: string, value: number) => {
    myriadAccountDispatch({
      type: 'STORE_BALANCE',
      key,
      value
    });
  };

  const addAddress = (key: string, value: string) => {
    myriadAccountDispatch({
      type: 'ADD_ADDRESS',
      key,
      value
    });
  };

  return (
    <>
      <Grid container direction="row" justify="space-between" alignItems="flex-start">
        <Grid item className={style.user}>
          <Grid className={style.fullheight} container direction="row" justify="flex-start" alignItems="stretch">
            <Grid item className={!!user.anonymous ? style.grow : style.normal}>
              <UserDetail changeSetting={changeSetting} settings={setting} />
            </Grid>
            <Grid item className={style.content}>
              <ShowIf condition={!setting.focus && !user.anonymous}>
                <NoSsr>
                  <Wallet />
                </NoSsr>
              </ShowIf>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={5} className={style.content}>
          {children}
        </Grid>

        <Grid item className={style.experience}>
          <ShowIf condition={!setting.focus}>
            <ExperienceComponent anonymous={!!user.anonymous} userId={userId} />
          </ShowIf>
        </Grid>
      </Grid>
    </>
  );
};

export default LayoutComponent;
