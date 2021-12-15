interface WelcomeModuleProps {
  displayName: string;
  username: string;
  isAvailable?: boolean;
  onSkip: () => void;
  onSubmit: (displayname: string, username: string) => void;
  checkAvailable: (username: string) => void;
}

export type {WelcomeModuleProps};
