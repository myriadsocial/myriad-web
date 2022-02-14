import {User} from '../../interfaces/user';

export type ProfileCardProps = {
  user?: User;
  alias?: string;
  notificationCount: number;
  handleSignOut: () => void;
  onViewProfile: () => void;
  onSwitchAccount: () => void;
  onShowNotificationList: () => void;
};
