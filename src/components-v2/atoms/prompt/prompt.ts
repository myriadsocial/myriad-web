export type Prompt = {
  togglePromt: () => void;
  open: boolean;
  variant?: 'sure' | 'careful' | 'success';
};
