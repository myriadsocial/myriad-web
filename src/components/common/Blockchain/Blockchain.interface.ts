import {UserWallet} from 'src/interfaces/user';
import {IProvider} from 'src/lib/services/blockchain-interface';

export interface BlockchainProviderProps {
  provider: IProvider;
  currentWallet: UserWallet;
  onChangeProvider: () => void;
}
