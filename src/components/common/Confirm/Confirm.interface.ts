export type ConfirmOptions = {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: 'danger' | 'warning' | 'success';
  cancellationText?: React.ReactNode;
  confirmationText?: React.ReactNode;
  hideCancel?: boolean;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
};

export interface ConfirmProviderProps {
  defaultOptions?: ConfirmOptions;
}
