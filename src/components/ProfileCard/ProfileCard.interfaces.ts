import {User, UserWallet} from '../../interfaces/user';

export type ProfileCardProps = {
  user?: User;
  currentWallet?: UserWallet;
  wallets?: UserWallet[];
  alias?: string;
  isMobile?: boolean;
  notificationCount: number;
  handleSignOut?: () => void;
  onViewProfile: () => void;
  onSwitchAccount?: () => void;
  onShowNotificationList: () => void;
};
