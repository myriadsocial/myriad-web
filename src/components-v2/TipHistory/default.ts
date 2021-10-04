import {MenuOptions} from '../atoms/DropdownMenu';

import {TransactionSort} from 'src/interfaces/transaction';

export const sortOptions: MenuOptions<TransactionSort>[] = [
  {
    id: 'highest',
    title: 'Highest Tip',
  },
  {
    id: 'latest',
    title: 'Latest Tip',
  },
];
