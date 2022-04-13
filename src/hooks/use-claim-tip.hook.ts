import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import _ from 'lodash';
import {Network} from 'src/interfaces/wallet';
import {NetworkTypeEnum} from 'src/lib/api/ext-auth';
import * as WalletAPI from 'src/lib/api/wallet';
import {getClaimTip, TipResult, claimMyria} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const useClaimTip = () => {
  const {user, networks, currentWallet} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipsEachNetwork, setTipsEachNetwork] = useState<Network[]>(networks);

  useEffect(() => {
    getTip();
  }, [networks]);

  const sortNetwork = (networks: Network[], selectedNetwork?: string) => {
    const newDefaultNetworks = [...networks];
    const defaultNetworks = _.remove(newDefaultNetworks, function (n) {
      return n.id === selectedNetwork;
    });
    const resultDefaultCoins = [...defaultNetworks, ...newDefaultNetworks];

    return resultDefaultCoins;
  };

  const getTip = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const serverId = await WalletAPI.getServerId();
      const tipBalanceInfo = {
        serverId: serverId,
        referenceType: 'user',
        referenceId: user.id,
        ftIdentifier: 'native',
      };
      const selectedNetwork = networks.find(option => option.id == NetworkTypeEnum.MYRIAD);
      if (!selectedNetwork) return;

      // GET MYRIA TIP
      const data = await getClaimTip(tipBalanceInfo, selectedNetwork?.rpcURL);
      if (data !== null) {
        const result: TipResult = {
          accountId: data.accountId,
          amount:
            data.amount == '0'
              ? data.amount
              : (parseFloat(data.amount.replace(/,/g, '')) / 10 ** 18).toFixed(3).toString(),
          tipsBalanceInfo: {
            ftIdentifier: data.tipsBalanceInfo.ftIdentifier,
            referenceId: data.tipsBalanceInfo.ftIdentifier,
            referenceType: data.tipsBalanceInfo.referenceType,
            serverId: data.tipsBalanceInfo.serverId,
          },
        };

        setTipsEachNetwork(
          sortNetwork(
            tipsEachNetwork.map(option => {
              if (option.id == NetworkTypeEnum.MYRIAD) {
                option.tips = [result];
              }
              return option;
            }),
            currentWallet?.network,
          ),
        );
      }
    } catch (error) {
      console.log(error);
      setError(error as any);
    } finally {
      setLoading(false);
    }
  };

  const claimTipMyria = async (networkId: string, ftIdentifier: string, callback?: () => void) => {
    if (!user) return;
    if (!currentWallet) return;
    setLoading(true);

    try {
      const serverId = await WalletAPI.getServerId();
      const tipBalanceInfo = {
        serverId: serverId,
        referenceType: 'user',
        referenceId: user.id,
        ftIdentifier: ftIdentifier,
      };
      if (networkId == NetworkTypeEnum.MYRIAD) {
        const selectedNetwork = networks.find(option => option.id == NetworkTypeEnum.MYRIAD);
        if (!selectedNetwork) return;

        await claimMyria(tipBalanceInfo, selectedNetwork?.rpcURL, currentWallet);
        await getTip();
      }
      callback && callback();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const claimAll = async (networkId: string, callback?: () => void) => {
    if (!user) return;
    setLoading(true);

    try {
      switch (networkId) {
        case NetworkTypeEnum.MYRIAD:
          await Promise.all([claimTipMyria(networkId, 'native')]);
          break;

        default:
          break;
      }

      callback && callback();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    tipsEachNetwork,
    error,
    loading,
    getTip,
    claimTipMyria,
    claimAll,
  };
};
