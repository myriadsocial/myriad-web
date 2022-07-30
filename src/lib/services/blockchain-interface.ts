import {ApiPromise} from '@polkadot/api';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {StorageKey, u32} from '@polkadot/types';
import {AnyTuple, Codec} from '@polkadot/types/types';
import {BN} from '@polkadot/util';

import {Server} from '../api/wallet';
import {Near} from './near-api-js';
import {Polkadot} from './polkadot-js';

import * as nearAPI from 'near-api-js';
import {Network, TipBalanceInfo} from 'src/interfaces/network';
import {WalletDetail} from 'src/interfaces/wallet';

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

  claimTipBalances: (
    serverId: string,
    referenceType: string,
    referenceIds: string[],
  ) => Promise<TipsResultProps[]>;

  claimTip: (
    serverId: string,
    referenceId: string,
    ...args: [string[], string, boolean]
  ) => Promise<void>;

  payTransactionFee: (
    tipsBalanceInfo: TipBalanceInfo,
    trxFee: string,
    ...args: [SignerProps, number | string, SignTransaction]
  ) => Promise<string>;

  estimateFee: (...args: WalletDetail[]) => Promise<EstimateFeeResponseProps>;

  claimReferenceFee: (...args: ClaimReferenceData[]) => Promise<BN>;

  disconnect: () => Promise<void>;

  assetMinBalance: (ftIdentifier?: string) => Promise<EstimateFeeResponseProps>;
}

export type SignatureProps = {nonce: number; publicAddress: string; signature: string};
export type TipsResultProps = TipResult | [StorageKey<AnyTuple>, Codec];
export type SignerProps = InjectedAccountWithMeta | nearAPI.ConnectedWalletAccount;
export type ProviderProps = ApiPromise | NearInitializeProps;
export type BlockchainProps = Polkadot | Near;
export type BalanceChanges = (change: BN) => void;
export type SignTransaction = (param: SignTransactionCallbackProps) => void;

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

export interface TipBalanceInfoNear {
  server_id: string;
  reference_type: string;
  reference_id: string;
  ft_identifier: string;
}

export interface TipsBalance {
  tips_balance_info: TipBalanceInfoNear;
  account_id: string;
  amount: string;
}

export interface TipResult {
  formatted_amount: string;
  symbol: string;
  tips_balance: TipsBalance;
  unclaimed_reference_ids: string[];
}

export interface TipResultWithPagination {
  data: TipResult[];
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
  get_tips_balances: (props: ContractTipsBalanceInfoProps) => TipResultWithPagination;
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

export type changeBalanceCallback = (change: BN) => void;
