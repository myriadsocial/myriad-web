import {User} from '../../interfaces/user';

interface ProfileHeaderProps {
  user: User;
  alias?: string;
  handleSignOut: () => void;
  onViewProfile: () => void;
  onSwitchAccount: () => void;
}

export type {ProfileHeaderProps};
