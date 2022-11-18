import {User, UserWallet} from '../../interfaces/user';

import {Network} from 'src/interfaces/network';

export type ProfileCardProps = {
  user?: User;
  anonymous?: boolean;
  currentWallet?: UserWallet;
  wallets?: UserWallet[];
  networks: Network[];
  alias?: string;
  isMobile?: boolean;
  notificationCount: number;
  handleSignOut?: () => void;
  handleLoginOrCreateAccount?: () => void;
  handleConnectWeb3Wallet?: () => void;
  onViewProfile: () => void;
  onShowNotificationList: () => void;
  userWalletAddress: null | string;
};
