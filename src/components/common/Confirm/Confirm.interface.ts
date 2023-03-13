export type ConfirmOptions = {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?:
    | 'danger'
    | 'warning'
    | 'success'
    | 'comment'
    | 'upvote'
    | 'downvote'
    | 'addTimeline'
    | 'tip'
    | 'createTimeline'
    | 'followTimeline';
  cancellationText?: React.ReactNode;
  confirmationText?: React.ReactNode;
  hideCancel?: boolean;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
};

export interface ConfirmProviderProps {
  defaultOptions?: ConfirmOptions;
}
