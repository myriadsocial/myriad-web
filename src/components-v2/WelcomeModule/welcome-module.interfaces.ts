interface WelcomeModuleProps {
  displayName: string;
  username: string;
  onSkip: () => void;
  onSubmit: (displayname: string, username: string) => void;
}

export type {WelcomeModuleProps};
