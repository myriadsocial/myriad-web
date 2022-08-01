import {ApiPromise} from '@polkadot/api';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {u32} from '@polkadot/types';
import {BN} from '@polkadot/util';

import {Near} from '../lib/services/near-api-js';
import {PolkadotJs} from '../lib/services/polkadot-js';

import * as nearAPI from 'near-api-js';
import {Network} from 'src/interfaces/network';
import {WalletDetail} from 'src/interfaces/wallet';
import {Server} from 'src/lib/api/server';

export interface IProvider {
  provider: ProviderProps;
  network: Network;
  accountId: string;

  signer: () => Promise<SignerProps>;

  getMetadata: () => Promise<number>;

  balances: (
    decimal: number,
    referenceId?: string,
    ...args: changeBalanceCallback[]
  ) => Promise<BalanceProps>;

  signTippingTransaction: (
    walletDetail: WalletDetail,
    amount: BN,
    referenceId?: string,
    ...args: [InjectedAccountWithMeta, SignTransaction]
  ) => Promise<string | null>;

  claimTip: (
    serverId: string,
    referenceId: string,
    ...args: [string[], string, boolean]
  ) => Promise<void>;

  payTransactionFee: (
    tipsBalanceInfo: TipsBalanceInfo,
    trxFee: string,
    ...args: [SignerProps, number | string, SignTransaction]
  ) => Promise<string>;

  estimateFee: (...args: WalletDetail[]) => Promise<EstimateFeeResponseProps>;

  disconnect: () => Promise<void>;

  assetMinBalance: (ftIdentifier?: string) => Promise<EstimateFeeResponseProps>;
}

export type SignatureProps = {nonce: number; publicAddress: string; signature: string};
export type SignerProps = InjectedAccountWithMeta | nearAPI.ConnectedWalletAccount;
export type ProviderProps = ApiPromise | NearInitializeProps;
export type BlockchainProps = PolkadotJs | Near;
export type BalanceChanges = (change: BN) => void;
export type SignTransaction = (param: SignTransactionCallbackProps) => void;
export type changeBalanceCallback = (change: BN) => void;

export type NearInitializeProps = {
  near: nearAPI.Near;
  wallet: nearAPI.WalletConnection;
};

export type BalanceProps = {
  balance: string;
  nonce?: u32;
};

export interface EstimateFeeResponseProps {
  partialFee: BN | null;
}

export interface SignTransactionCallbackProps {
  apiConnected?: boolean;
  signerOpened?: boolean;
  transactionSucceed?: boolean;
  transactionFailed?: boolean;
  message?: string;
}

export interface signAndSendExtrinsicProps {
  value: BN;
  referenceId: string;
  walletDetail: WalletDetail;
}

export interface TipsBalanceInfo {
  ftIdentifier: string;
  referenceId: string;
  referenceType: string;
  serverId: string;
}

export interface TipsBalance {
  tipsBalanceInfo: TipsBalanceInfo;
  amount: BN;
  accountId: string;
}

export interface TipsBalanceData {
  [any: string]: TipsBalance;
}

export interface TipsBalanceInfoNear {
  server_id: string;
  reference_type: string;
  reference_id: string;
  ft_identifier: string;
}

export interface TipsBalanceNear {
  tips_balance_info: TipsBalanceInfoNear;
  account_id: string;
  amount: string;
}

export interface TipsNearResult {
  formatted_amount: string;
  symbol: string;
  tips_balance: TipsBalanceNear;
  unclaimed_reference_ids: string[];
}

export interface TipsNearResultWithPagination {
  data: TipsNearResult[];
  meta: Meta;
}

export interface Meta {
  current_page?: number;
  items_per_page: number;
  next_page?: number;
  previous_page?: number;
  total_item_count: number;
  total_page_count: number;
}

export interface ContractBalanceProps {
  account_id: string;
}

export interface ContractReceiverProps {
  receiver_id: string;
  amount: string;
}

export interface ContractStorageBalanceProps {
  available: string;
  total: string;
}

export interface ContractTipsBalanceInfoProps {
  server_id: string;
  reference_type: string;
  reference_ids: string[];
  main_ref_type: string;
  main_ref_id: string;
  page_number?: number;
  page_limit?: number;
}

export interface ContractProps {
  ft_balance_of: (props: ContractBalanceProps) => string;
  ft_transfer: (
    contractReceiver: ContractReceiverProps,
    attachedGas: string,
    attachedAmount: string,
  ) => void;
  storage_balance_of: (props: ContractBalanceProps) => null | ContractStorageBalanceProps;
  storage_deposit: (props: ContractBalanceProps) => void;
}

export interface References {
  referenceType: string;
  referenceIds: string[];
}

export interface ClaimReferenceData {
  references: References;
  mainReferences: References;
  currencyIds: string[];
  server?: Server;
}

export interface TipsResult {
  tipsBalanceInfo: TipsBalanceInfo;
  accountId: string;
  amount: string;
  symbol: string;
  imageURL: string;
}

export interface TipsResultsProps {
  tipsResults: TipsResult[];
  feeInfo?: FeeInfo;
}

export interface FeeInfo {
  formattedTrxFee: string;
  trxFee: string;
}
