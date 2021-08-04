import {options} from '@acala-network/api';

import {useState} from 'react';

import {ApiPromise, WsProvider} from '@polkadot/api';
import {Keyring} from '@polkadot/keyring';

import {
  useWalletAddress as baseUseWalletAddress,
  WalletAddressActionType,
} from '../components/common/sendtips/send-tip.context';
import {
  useBalance as baseUseBalance,
  BalanceActionType,
} from '../components/wallet/balance.context';

import {useAlertHook} from 'src/hooks/use-alert.hook';
import {TokenId} from 'src/interfaces/token';
import {Token} from 'src/interfaces/token';
import {ContentType} from 'src/interfaces/wallet';
import {updateTips} from 'src/lib/api/post';
import {storeTransaction} from 'src/lib/api/transaction';

type Props = {
  fromAddress: string;
  toAddress: string;
  amountSent: number;
  decimals: number;
  currencyId: string;
  postId: string;
  contentType: ContentType;
  wsAddress: string;
};

const formatNumber = (number: number, decimals: number) => {
  if (number.toString() === '0') return 0;
  const result = Number((Number(number.toString()) / 10 ** decimals).toFixed(5));
  return result;
};

// params mungkin butuh address sama tipe wsProvider
export const usePolkadotApi = () => {
  const {state, dispatch} = baseUseBalance();
  const {showAlert, showTipAlert} = useAlertHook();
  const {state: walletAddressState, dispatch: walletAddressDispatch} = baseUseWalletAddress();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectToBlockchain = async (wsProvider: string) => {
    let api: ApiPromise;
    try {
      const provider = new WsProvider(wsProvider);
      api = new ApiPromise(options({provider}));
      await api.isReadyOrError;
      return api;
    } catch (error) {
      setError(error);
      return;
    }
  };

  const load = async (address: string, availableTokens: Token[]) => {
    setLoading(true);
    const tokenBalances = [];

    try {
      for (let i = 0; i < availableTokens.length; i++) {
        const provider = availableTokens[i].rpc_address;
        const api = await connectToBlockchain(provider);

        if (api) {
          switch (availableTokens[i].id) {
            case TokenId.MYRIA: {
              const {data: balance} = await api.query.system.account(address);
              const tempBalance = balance.free as unknown;
              tokenBalances.push({
                freeBalance: formatNumber(tempBalance as number, availableTokens[i].token_decimal),
                tokenSymbol: availableTokens[i].id,
                tokenDecimals: availableTokens[i].token_decimal,
                rpcAddress: provider,
                tokenImage: availableTokens[i].token_image,
              });
              break;
            }

            //TODO: make enum based on rpc_address, collect the api calls and use multiqueries
            case TokenId.ACA: {
              const {data: balance} = await api.query.system.account(address);
              const tempBalance = balance.free as unknown;
              tokenBalances.push({
                freeBalance: formatNumber(tempBalance as number, availableTokens[i].token_decimal),
                tokenSymbol: availableTokens[i].id,
                tokenDecimals: availableTokens[i].token_decimal,
                rpcAddress: provider,
                tokenImage: availableTokens[i].token_image,
              });
              break;
            }

            // should be for tokens of Acala, e.g. AUSD, DOT
            default: {
              const tokenData: any = await api.query.tokens.accounts(address, {
                TOKEN: availableTokens[i].id,
              });
              tokenBalances.push({
                freeBalance: formatNumber(
                  tokenData.free as number,
                  availableTokens[i].token_decimal,
                ),
                tokenSymbol: availableTokens[i].id,
                tokenDecimals: availableTokens[i].token_decimal,
                rpcAddress: provider,
                tokenImage: availableTokens[i].token_image,
              });
            }
          }

          await api.disconnect();
        }
      }
      dispatch({
        type: BalanceActionType.INIT_BALANCE,
        balanceDetails: tokenBalances,
      });
    } catch (error) {
      console.log({error});
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const sendTip = async (
    {
      fromAddress,
      toAddress,
      amountSent,
      decimals,
      currencyId,
      postId,
      contentType,
      wsAddress,
    }: Props,
    callback?: () => void,
  ) => {
    walletAddressDispatch({
      type: WalletAddressActionType.INIT_SEND_TIPS,
    });

    setLoading(true);
    try {
      const {enableExtension} = await import('../helpers/extension');
      const {web3FromSource} = await import('@polkadot/extension-dapp');

      const allAccounts = await enableExtension();
      // We select the first account found by using fromAddress
      // `account` is of type InjectedAccountWithMeta
      const keyring = new Keyring();
      const baseAddress = keyring.encodeAddress(
        fromAddress,
        Number(process.env.NEXT_PUBLIC_MYRIAD_ADDRESS_PREFIX),
      );
      const account = allAccounts?.find(function (account) {
        // address from session must match address on polkadot extension
        return account.address === baseAddress;
      });

      // if account has not yet been imported to Polkadot.js extension
      if (account === undefined) {
        throw {
          Error: 'Please import your account first!',
        };
      }

      // otherwise
      if (account) {
        const api = await connectToBlockchain(wsAddress);

        if (api) {
          // here we use the api to create a balance transfer to some account of a value of 12345678
          const transferExtrinsic =
            currencyId === 'ACA'
              ? api?.tx.balances.transfer(toAddress, amountSent)
              : api?.tx.currencies.transfer(toAddress, {TOKEN: currencyId}, amountSent);

          // to be able to retrieve the signer interface from this account
          // we can use web3FromSource which will return an InjectedExtension type
          const injector = await web3FromSource(account.meta.source);

          if (transferExtrinsic) {
            // passing the injected account address as the first argument of signAndSend
            // will allow the api to retrieve the signer and the user will see the extension
            // popup asking to sign the balance transfer transaction
            const txInfo = await transferExtrinsic.signAndSend(fromAddress, {
              signer: injector.signer,
            });

            // Only update the tip sent to a post, but
            // not to a comment
            if (contentType === ContentType.POST) {
              await updateTips(currencyId, amountSent, postId);
            }

            const correctedValue = amountSent / 10 ** decimals;

            if (txInfo) {
              // Record the transaction
              await storeTransaction({
                trxHash: txInfo.toHex(),
                from: fromAddress,
                to: toAddress,
                value: correctedValue,
                state: 'success',
                tokenId: currencyId,
                createdAt: new Date().toISOString(),
                postId,
              });

              walletAddressDispatch({
                type: WalletAddressActionType.SEND_TIPS_SUCCESS,
                amountSent: correctedValue,
                from: baseAddress,
                to: toAddress,
                trxHash: txInfo.toHex(),
                tokenId: currencyId,
                success: true,
              });

              showTipAlert({
                severity: 'success',
                title: 'Tip sent!',
                message: `${txInfo.toHex()}`,
              });

              callback && callback();
            }

            await api.disconnect();
          }
        }
      }
    } catch (error) {
      if (error.message === 'Cancelled') {
        showAlert({
          severity: 'warning',
          title: 'Aborted!',
          message: 'Transaction signing cancelled',
        });
      }
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    load,
    tokensReady: state.balanceDetails,
    sendTip,
    sendTipSuccess: walletAddressState.success,
    trxHash: walletAddressState.trxHash,
  };
};
