import {PostOrigin} from 'src/interfaces/timeline';

export type Props = {
  origin: PostOrigin;
  avatar?: string;
  name: string;
  onClick: () => void;
};
