export type Prompt = {
  open: boolean;
  icon: 'danger' | 'warning' | 'success';
  title: string;
  subtitle: string;
  onCancel: () => void;
};
