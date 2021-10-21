import {PostOrigin} from '../../../../interfaces/timeline';

export type Props = {
  origin: PostOrigin;
  avatar?: string;
  name: string;
  onClick: () => void;
};
