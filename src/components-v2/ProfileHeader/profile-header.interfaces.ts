import {User} from '../../interfaces/user';

interface ProfileHeaderProps {
  alias?: string;
  user: User;
  handleSignOut: () => void;
}

export type {ProfileHeaderProps};
