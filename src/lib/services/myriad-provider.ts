import getConfig from 'next/config';

import {ApiPromise, WsProvider} from '@polkadot/api';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {ServerListProps} from 'src/interfaces/server-list';

const {publicRuntimeConfig} = getConfig();

export interface IProvider {
  provider: ApiPromise;

  signer: (accountId: string) => Promise<InjectedAccountWithMeta>;

  totalServer: () => Promise<number>;

  serverList: (startKey?: string, pageSize?: number) => Promise<ServerListProps[]>;

  serverListByOwner: (
    accountId: string,
    startKey?: string,
    pageSize?: number,
  ) => Promise<ServerListProps[]>;

  disconnect: () => Promise<void>;
}

export class MyriadProvider implements IProvider {
  private readonly _provider: ApiPromise;

  constructor(provider: ApiPromise) {
    this._provider = provider;
  }

  get provider() {
    return this._provider;
  }

  static async connect() {
    try {
      const provider = new WsProvider(publicRuntimeConfig.myriadRPCURL);
      const api = new ApiPromise({provider});

      await api.isReadyOrError;

      return new MyriadProvider(api);
    } catch {
      return null;
    }
  }

  async signer(accountId: string): Promise<InjectedAccountWithMeta> {
    const {enableExtension} = await import('src/helpers/extension');
    const allAccounts = await enableExtension();

    if (!allAccounts || allAccounts.length === 0) {
      throw new Error('Please import your account first!');
    }

    const currentAccount = allAccounts.find(account => {
      // address from session must match address on polkadot extension
      return account.address === accountId;
    });

    if (!currentAccount) {
      throw new Error('Account not registered on Polkadot.js extension');
    }

    return currentAccount;
  }

  async totalServer(): Promise<number> {
    try {
      const result = await this.provider.query.server.serverCount();

      return result.toJSON() as number;
    } catch {
      return 0;
    }
  }

  async serverList(startKey?: string, pageSize = 10): Promise<ServerListProps[]> {
    try {
      const result = await this.provider.query.server.serverById.entriesPaged({
        args: [],
        pageSize,
        startKey,
      });

      const data = result.map(list => {
        return list[1].toHuman();
      });

      return data as unknown as ServerListProps[];
    } catch (error) {
      console.log({error});
      return [];
    }
  }

  async serverListByOwner(
    accountId: string,
    startKey?: string,
    pageSize = 10,
  ): Promise<ServerListProps[]> {
    try {
      const result = await this.provider.query.server.serverByOwner.entriesPaged({
        args: [accountId],
        pageSize,
        startKey,
      });

      const data = result.map(list => {
        return list[1].toHuman();
      });

      return data as unknown as ServerListProps[];
    } catch {
      return [];
    }
  }

  async disconnect(): Promise<void> {
    await this.provider.disconnect();
  }
}
