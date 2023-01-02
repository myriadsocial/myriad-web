export type EditorProps = {
  userId?: string;
  mobile?: boolean;
  isErrorEditor?: boolean;
  placeholder?: string;
  onSearchMention?: (query: string) => void;
  onReady?: (editor: any) => void;
  onChange?: (data: any, loading: boolean) => void;
  children?: React.ReactNode;
};
