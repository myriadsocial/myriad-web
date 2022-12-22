import {InformationCircleIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Button, SvgIcon, Typography} from '@material-ui/core';

import {BN, BN_ZERO} from '@polkadot/util';

import CurrencyOption from './CurrencyOption';
import {useStyles} from './ExclusiveCreate.styles';

import {serialize} from 'components/PostCreate/formatter';
import {checkEditor, Editor, getEditorSelectors} from 'components/common/Editor';
import {TermOfService} from 'components/common/TermOfService';
import {InputAmount} from 'components/common/Tipping/render/InputAmount';
import {Currency} from 'src/interfaces/currency';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

type PostCreateProps = {
  user: User;
  isMobile?: boolean;
  onSearchPeople: (query: string) => void;
  onSubmit?: (
    post: Partial<Post> | string,
    attributes?: Pick<Post, 'NSFWTag' | 'visibility'>,
  ) => void;
};

const INITIAL_AMOUNT = new BN(-1);

export const ExclusiveCreate: React.FC<PostCreateProps> = props => {
  const {user, isMobile, onSearchPeople, onSubmit} = props;
  const styles = useStyles();
  const [currency, setCurrency] = useState<Currency>();
  const [amount, setAmount] = useState<BN>(INITIAL_AMOUNT);
  const [agreementChecked, setAgreementChecked] = useState<boolean>(false);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(true);
  const [isErrorEditor, setIsErrorEditor] = useState<boolean>(false);

  const {availableCurrencies: balances} = useSelector<RootState, ConfigState>(
    state => state.configState,
  );

  const handleSelectCurrency = (currency: Currency) => {
    setCurrency(currency);
  };

  const handleChangeAgreement = (accepted: boolean) => {
    setAgreementChecked(accepted);
  };

  const handleSubmit = () => {
    const store = getEditorSelectors(`exclusive-${user.id}`);
    const value = store.value();

    if (checkEditor(value)) {
      setIsErrorEditor(false);
      const attributes = serialize(value);

      onSubmit({
        ...attributes,
      });
    } else {
      setIsErrorEditor(true);
    }
  };

  useEffect(() => {
    if (agreementChecked && currency && !amount.lte(BN_ZERO)) setIsDisabledButton(false);
    else setIsDisabledButton(true);
  }, [agreementChecked, currency, amount]);

  return (
    <>
      <div style={{marginBottom: 20}}>
        <Editor
          userId={`exclusive-${user.id}`}
          mobile={isMobile}
          onSearchMention={onSearchPeople}
          isErrorEditor={isErrorEditor}
        />
      </div>
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
          display: isMobile ? 'relative' : 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <TermOfService
          about={i18n.t('ExclusiveContent.Label.ExclusiveContent')}
          onChange={handleChangeAgreement}
        />
        <Button
          className={styles.buttonSubmit}
          disabled={isDisabledButton}
          variant="contained"
          color="primary"
          size="small"
          fullWidth={isMobile}
          onClick={handleSubmit}>
          {i18n.t('Post_Create.Confirm')}
        </Button>
      </div>
    </>
  );
};

export default ExclusiveCreate;
