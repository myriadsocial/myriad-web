import {User} from '../../interfaces/user';

interface ProfileHeaderProps {
  user?: User;
  alias?: string;
  notificationCount: number;
  handleSignOut: () => void;
  onViewProfile: () => void;
  onSwitchAccount: () => void;
  onShowNotificationList: () => void;
}

export type {ProfileHeaderProps};
