import React, {useState} from 'react';

import {createStyles, Theme, makeStyles} from '@material-ui/core/styles';

import {BalanceDetailList} from '../BalanceDetailList/BalanceDetailList';
import {BoxComponent} from '../atoms/Box/';
import {TabsComponent} from '../atoms/Tabs/';
import {Button, ButtonVariant, ButtonColor} from '../atoms/button/';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    balanceTabActions: {
      display: 'flex',
      columnGap: theme.spacing(2.875),
    },
  }),
);

// TODO: move this to interfaces/balance.ts when rewiring data
type CurrencyDetail = {
  id: string;
  name: string;
  image: string;
  decimal: number;
  rpcURL: string;
};

export type BalanceDetail = CurrencyDetail & {
  freeBalance: number;
};

type MyWalletProps = {
  headerTitle: string;
  balanceDetails: BalanceDetail[];
};

export const MyWallet: React.FC<MyWalletProps> = props => {
  const classes = useStyles();
  const {headerTitle, balanceDetails} = props;

  const [tabTexts] = useState([
    {
      id: 'first-tab',
      title: 'Balance',
      component: <BalanceDetailList balanceDetails={balanceDetails} />,
    },
    {id: 'second-tab', title: 'History', component: 'History component'},
  ]);

  const handleChangeTab = () => {
    console.log('changed tab!');
  };

  return (
    <BoxComponent isWithChevronRightIcon={false} title={headerTitle} isFitContent={true}>
      <TabsComponent
        active={tabTexts[0].id}
        tabs={tabTexts}
        position={'space-around'}
        mark="underline"
        size="small"
        onChangeTab={handleChangeTab}
        optionalPadding={0}
      />
      <div className={classes.balanceTabActions}>
        <Button variant={ButtonVariant.OUTLINED} color={ButtonColor.SECONDARY}>
          Set coin priority
        </Button>
        <Button variant={ButtonVariant.CONTAINED}>+ Add coin</Button>
      </div>
    </BoxComponent>
  );
};
