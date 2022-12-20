import {InformationCircleIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import {Button, SvgIcon, Typography} from '@material-ui/core';

import {BN} from '@polkadot/util';

import {Modal} from '../atoms/Modal';
import CurrencyOption from './CurrencyOption';
import {useStyles} from './ExclusiveCreate.styles';

import {Editor} from 'components/common/Editor';
import {TermOfService} from 'components/common/TermOfService';
import {InputAmount} from 'components/common/Tipping/render/InputAmount';
import {BalanceDetail} from 'src/interfaces/balance';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';

type PostCreateProps = {
  user: User;
  open: boolean;
  isMobile?: boolean;
  onClose: () => void;
  onSearchPeople: (query: string) => void;
  onSubmit: (
    post: Partial<Post> | string,
    attributes?: Pick<Post, 'NSFWTag' | 'visibility'>,
  ) => void;
};

const INITIAL_AMOUNT = new BN(-1);

export const ExclusiveCreate: React.FC<PostCreateProps> = props => {
  const {open, user, isMobile, onClose, onSearchPeople} = props;
  const styles = useStyles();
  const [currency, setCurrency] = useState<BalanceDetail>();
  const [amount, setAmount] = useState<BN>(INITIAL_AMOUNT);
  const [agreementChecked, setAgreementChecked] = useState<boolean>(false);

  const {balanceDetails: balances} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );
  const handleClose = () => {
    onClose();
  };

  const handleSelectCurrency = (currency: BalanceDetail) => {
    setCurrency(currency);
  };

  const handleChangeAgreement = (accepted: boolean) => {
    setAgreementChecked(accepted);
  };

  const handleSubmit = () => {
    return null;
  };

  const isDisabledButton = !agreementChecked;

  return (
    <Modal
      title={i18n.t('ExclusiveContent.Create')}
      onClose={handleClose}
      open={open}
      fullScreen={isMobile}
      maxWidth="md"
      className={styles.root}>
      <Editor userId={user.id} mobile={isMobile} onSearchMention={onSearchPeople} />
      <div className={styles.currencyWrapper}>
        <div style={{width: 'calc(100% - 152px)'}}>
          <InputAmount
            type="exclusive"
            defaultValue={amount}
            placeholder={i18n.t('ExclusiveContent.Label.ExclusiveContentPrice')}
            decimal={currency?.decimal}
            length={10}
            currencyId={currency?.symbol}
            onChange={setAmount}
          />
          <Typography className={styles.usd}>1 USDT = 1 USD</Typography>
        </div>
        <CurrencyOption
          balances={balances}
          currentCurrency={currency}
          handleSelect={handleSelectCurrency}
        />
      </div>
      <div className={styles.feeWrapper}>
        <SvgIcon component={InformationCircleIcon} className={styles.icon} />
        <Typography variant="subtitle2">{i18n.t('ExclusiveContent.Label.Fee')}</Typography>
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <TermOfService
          about={i18n.t('Tipping.Modal_Main.About')}
          onChange={handleChangeAgreement}
        />
        <Button
          disabled={isDisabledButton}
          variant="contained"
          color="primary"
          size="small"
          fullWidth={isMobile}
          onClick={handleSubmit}>
          {i18n.t('Post_Create.Confirm')}
        </Button>
      </div>
    </Modal>
  );
};

export default ExclusiveCreate;
