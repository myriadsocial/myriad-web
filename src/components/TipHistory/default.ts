import {MenuOptions} from '../atoms/DropdownMenu';

import {TransactionSort} from 'src/interfaces/transaction';
import i18n from 'src/locale';

export const sortOptions: MenuOptions<TransactionSort>[] = [
  {
    id: 'highest',
    title: i18n.t('Tipping_History.Modal.Sort_Highest'),
  },
  {
    id: 'latest',
    title: i18n.t('Tipping_History.Modal.Sort_Latest'),
  },
];
