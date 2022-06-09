export type Prompt = {
  open: boolean;
  icon?: 'danger' | 'warning' | 'success';
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  onCancel: () => void;
};
