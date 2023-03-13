export type Prompt = {
  open: boolean;
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
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  onCancel: () => void;
};
