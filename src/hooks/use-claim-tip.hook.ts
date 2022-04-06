import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {Network} from 'src/interfaces/wallet';
import {getClaimTip, TipResult} from 'src/lib/services/polkadot-js';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const useClaimTip = () => {
  const {user, networks} = useSelector<RootState, UserState>(state => state.userState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tipsEachNetwork, setTipsEachNetwork] = useState<Network[]>(networks);

  useEffect(() => {
    getTip();
  }, [networks]);

  const getTip = async () => {
    if (!user) return;
    setLoading(true);

    const tipBalanceInfo = {
      serverId: '0x75cf5fd717c518edd73ed7128373f219b1954569a71a86741d69eb9d851e91a9',
      referenceType: 'user',
      referenceId: user.id,
      ftIdentifier: 'native',
    };

    try {
      const selectedNetwork = networks.find(option => option.id == 'myriad');
      if (!selectedNetwork) return;

      const data = await getClaimTip(tipBalanceInfo, selectedNetwork?.rpcURL);
      if (data !== null) {
        const result: TipResult = {
          accountId: data.accountId,
          amount: (parseInt(data.amount, 16) / 10 ** 18).toFixed(3).toString(),
          tipsBalanceInfo: {
            ftIdentifier: data.tipsBalanceInfo.ftIdentifier,
            referenceId: data.tipsBalanceInfo.ftIdentifier,
            referenceType: data.tipsBalanceInfo.referenceType,
            serverId: data.tipsBalanceInfo.serverId,
          },
        };

        setTipsEachNetwork(
          tipsEachNetwork.map(option => {
            if (option.id == 'myriad') {
              option.tips = [result];
            }
            return option;
          }),
        );
      }
    } catch (error) {
      console.log(error);
      setError(error as any);
    } finally {
      setLoading(false);
    }
  };

  // const claimTipMyria = async () => {
  //   if (!user) return;
  //   setLoading(true);

  //   const tipBalanceInfo = {
  //     serverId: '0x75cf5fd717c518edd73ed7128373f219b1954569a71a86741d69eb9d851e91a9',
  //     referenceType: 'user',
  //     referenceId: user.id,
  //     ftIdentifier: 'native',
  //   };

  //   try {
  //     const selectedNetwork = networks.find(option => option.id == 'myriad');
  //     if (!selectedNetwork) return;

  //     const data = await claimMyria(tipBalanceInfo, selectedNetwork?.rpcURL);
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    tipsEachNetwork,
    error,
    loading,
    getTip,
    // claimTipMyria,
  };
};
