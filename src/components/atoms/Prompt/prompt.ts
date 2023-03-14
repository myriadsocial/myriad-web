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
    | 'followTimeline'
    | 'createPost'
    | 'people';
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  onCancel: () => void;
};
