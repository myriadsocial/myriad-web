import {User, UserWallet} from '../../interfaces/user';

import {Network} from 'src/interfaces/wallet';

export type ProfileCardProps = {
  user?: User;
  currentWallet?: UserWallet;
  wallets?: UserWallet[];
  networks: Network[];
  alias?: string;
  isMobile?: boolean;
  notificationCount: number;
  handleSignOut?: () => void;
  onViewProfile: () => void;
  onSwitchAccount?: () => void;
  onShowNotificationList: () => void;
};
