export type Prompt = {
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
  variant?: 'sure' | 'careful' | 'success';
};
