import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import getConfig from 'next/config';

import BN from 'bn.js';
import * as nearAPI from 'near-api-js';
import {BlockchainPlatform, WalletDetail, WalletReferenceType} from 'src/interfaces/wallet';
import {
  nearInitialize,
  connectToNearWallet,
  NearConnectResponseProps,
  contractInitialize,
} from 'src/lib/services/near-api-js';
import {RootState} from 'src/reducers';
import {fetchBalances} from 'src/reducers/balance/actions';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

const {publicRuntimeConfig} = getConfig();

export const useNearApi = () => {
  const dispatch = useDispatch();

  const {anonymous, currencies, currentWallet} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {balanceDetails} = useSelector<RootState, BalanceState>(state => state.balanceState);

  useEffect(() => {
    if (
      !anonymous &&
      currencies.length > 0 &&
      balanceDetails.length === 0 &&
      currentWallet?.network?.blockchainPlatform === BlockchainPlatform.NEAR
    ) {
      dispatch(fetchBalances());
    }
  }, [anonymous, currencies, balanceDetails, currentWallet]);

  const connectToNear = async (
    callbackUrl?: string,
    failedCallbackUrl?: string,
  ): Promise<NearConnectResponseProps | null> => {
    const {near, wallet} = await nearInitialize();

    return connectToNearWallet(near, wallet, callbackUrl, failedCallbackUrl);
  };

  const getEstimatedFee = async (): Promise<{gasPrice: string}> => {
    const {near} = await nearInitialize();
    const blockStatus = await near.connection.provider.status();
    const gas = await near.connection.provider.gasPrice(blockStatus.sync_info.latest_block_hash);
    const gasPrice = nearAPI.utils.format.formatNearAmount(gas.gas_price);
    return {gasPrice};
  };

  const sendAmount = async (
    walletDetail: WalletDetail,
    amount: BN,
    tokenContractId?: string,
  ): Promise<void> => {
    const {wallet} = await nearInitialize();
    const account = wallet.account();
    const walletReferenceType = walletDetail.referenceType;
    const receiver =
      walletReferenceType === WalletReferenceType.WALLET_ADDRESS
        ? walletDetail.referenceId
        : undefined;

    if (receiver) await sendAmountToMyriadUser(account, receiver, amount, tokenContractId);
    else await sendAmountToNonMyriadUser(account, walletDetail, amount, tokenContractId);
  };

  const sendAmountToMyriadUser = async (
    account: nearAPI.ConnectedWalletAccount,
    receiver: string,
    amount: BN,
    tokenContractId?: string,
  ): Promise<void> => {
    if (!tokenContractId) {
      await account.sendMoney(receiver, amount);
      return;
    }

    const ONE_YOCTO = '1';
    const MAX_GAS = '300000000000000';
    const ATTACHED_AMOUNT = '1250000000000000000000';
    const ATTACHED_GAS = '10000000000000';
    const contract = await contractInitialize(tokenContractId);
    const isDeposit = await contract.storage_balance_of({account_id: receiver});
    const actions: nearAPI.transactions.Action[] = !isDeposit
      ? [
          nearAPI.transactions.functionCall(
            'storage_deposit',
            Buffer.from(JSON.stringify({account_id: receiver})),
            new BN(ATTACHED_GAS),
            new BN(ATTACHED_AMOUNT),
          ),
        ]
      : [];

    actions.push(
      nearAPI.transactions.functionCall(
        'ft_transfer',
        Buffer.from(JSON.stringify({receiver_id: receiver, amount: amount.toString()})),
        new BN(MAX_GAS).sub(new BN(ATTACHED_GAS)),
        new BN(ONE_YOCTO),
      ),
    );
    //TODO: fix error protected class for multiple sign and send transactions
    // @ts-ignore: protected class
    await account.signAndSendTransaction({receiverId: tokenContractId, actions});
  };

  const sendAmountToNonMyriadUser = async (
    account: nearAPI.ConnectedWalletAccount,
    walletDetail: WalletDetail,
    amount: BN,
    tokenContractId?: string,
  ): Promise<void> => {
    const tippingContractId = publicRuntimeConfig.nearTippingContractId;
    const tipsBalanceInfo = {
      server_id: walletDetail.serverId,
      reference_type: walletDetail.referenceType,
      reference_id: walletDetail.referenceId,
      ft_identifier: walletDetail.ftIdentifier,
    };

    let maxAttachedGas = new BN('300000000000000');
    let receiverId = tippingContractId;
    let method = 'send_tip';
    let data = JSON.stringify({tips_balance_info: tipsBalanceInfo});
    let attachedAmount = amount;
    let initActions: nearAPI.transactions.Action[] = [];

    if (tokenContractId) {
      const contract = await contractInitialize(walletDetail.ftIdentifier);
      const isDeposit = await contract.storage_balance_of({account_id: tippingContractId});

      if (!isDeposit) {
        const ATTACHED_AMOUNT = '1250000000000000000000';
        const ATTACHED_GAS = '10000000000000';

        initActions = [
          nearAPI.transactions.functionCall(
            'storage_deposit',
            Buffer.from(JSON.stringify({account_id: tippingContractId})),
            new BN(ATTACHED_GAS),
            new BN(ATTACHED_AMOUNT),
          ),
        ];

        maxAttachedGas = maxAttachedGas.sub(new BN(ATTACHED_GAS));
      }

      receiverId = tokenContractId;
      method = 'ft_transfer_call';
      attachedAmount = new BN('1');
      data = JSON.stringify({
        receiver_id: tippingContractId,
        amount: amount.toString(),
        msg: JSON.stringify(tipsBalanceInfo),
      });
    }

    const actions = [
      ...initActions,
      nearAPI.transactions.functionCall(method, Buffer.from(data), maxAttachedGas, attachedAmount),
    ];

    //TODO: fix error protected class for multiple sign and send transactions
    // @ts-ignore: protected class
    await account.signAndSendTransaction({receiverId, actions});
  };

  const sendAmountV2 = async (
    receiver: string,
    amount: BN,
    referenceId?: string,
  ): Promise<void> => {
    const {wallet} = await nearInitialize();

    if (referenceId) {
      const ONE_YOCTO = '1';
      const MAX_GAS = '300000000000000';
      const ATTACHED_AMOUNT = '1250000000000000000000';
      const ATTACHED_GAS = '10000000000000';
      const contract = await contractInitialize(referenceId);
      const check_storage = await (contract as any).storage_balance_of({account_id: receiver});
      const actions: nearAPI.transactions.Action[] = [];

      if (!check_storage) {
        actions.push(
          nearAPI.transactions.functionCall(
            'storage_deposit',
            Buffer.from(JSON.stringify({account_id: receiver, registration_only: true})),
            new BN(ATTACHED_GAS),
            new BN(ATTACHED_AMOUNT),
          ),
        );
      }

      actions.push(
        nearAPI.transactions.functionCall(
          'ft_transfer',
          Buffer.from(JSON.stringify({receiver_id: receiver, amount: amount.toString()})),
          new BN(MAX_GAS).sub(new BN(ATTACHED_GAS)),
          new BN(ONE_YOCTO),
        ),
      );

      const accountId = wallet.getAccountId();
      const provider = new nearAPI.providers.JsonRpcProvider(
        `https://rpc.${wallet._networkId}.near.org`,
      );
      const {
        public_key,
        access_key: {nonce},
      } = await wallet.account().accessKeyForTransaction(referenceId, actions);
      const accessKey = await provider.query(
        `access_key/${accountId}/${public_key.toString()}`,
        '',
      );
      const recentBlockHash = nearAPI.utils.serialize.base_decode(accessKey.block_hash);
      const signer = new nearAPI.InMemorySigner(wallet._keyStore);
      const publicKey = await signer.getPublicKey(accountId, wallet._networkId);
      const transaction = nearAPI.transactions.createTransaction(
        accountId,
        publicKey,
        referenceId,
        nonce + 1,
        actions,
        recentBlockHash,
      );
      await wallet.requestSignTransactions({transactions: [transaction]});
    } else {
      const account = wallet.account();
      await account.sendMoney(receiver, amount);
    }
  };

  return {
    connectToNear,
    getEstimatedFee,
    sendAmount,
    balanceDetails,
    sendAmountV2,
  };
};
