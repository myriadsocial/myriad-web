import React from 'react';
import {useSelector} from 'react-redux';

import NoSsr from '@material-ui/core/NoSsr';

import {BalanceDetailList} from '.';
import {BoxComponent} from '../atoms/Box';

import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {UserState} from 'src/reducers/user/reducer';

export const BalanceDetailListContainer: React.FC = () => {
  const {balanceDetails, loading} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  if (!user) return null;

  return (
    <NoSsr>
      <BoxComponent isWithChevronRightIcon={false} marginTop={'20px'}>
        <BalanceDetailList balanceDetails={balanceDetails} isLoading={loading} />
      </BoxComponent>
    </NoSsr>
  );
};

export default BalanceDetailListContainer;
