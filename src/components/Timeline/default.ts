import {MenuOptions} from '../atoms/DropdownMenu';

import {ExperienceType} from 'src/interfaces/experience';
import i18n from 'src/locale';

export type BalanceSortType = 'aToZ' | 'highest' | 'lowest' | 'all';
// TODO: move this to experience tab
export const experienceFilterOptions: MenuOptions<ExperienceType>[] = [
  {id: 'all', title: 'All Experience'},
  {id: 'personal', title: 'Personal Experience'},
  {id: 'other', title: 'Subscribed Experience'},
];

// TODO: move this to balance detail list
export const balanceSortOptions: MenuOptions<BalanceSortType>[] = [
  {
    id: 'highest',
    title: i18n.t('Wallet.Balance.Sort_Opt.Highest'),
  },
  {
    id: 'lowest',
    title: i18n.t('Wallet.Balance.Sort_Opt.Lowest'),
  },
];
