import {User, CurrentUserWallet} from '../../interfaces/user';

export type ProfileCardProps = {
  user?: User;
  currentWallet?: CurrentUserWallet;
  alias?: string;
  isMobile?: boolean;
  notificationCount: number;
  handleSignOut?: () => void;
  onViewProfile: () => void;
  onSwitchAccount?: () => void;
  onShowNotificationList: () => void;
};
