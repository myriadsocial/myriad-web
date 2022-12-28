import {InformationCircleIcon} from '@heroicons/react/outline';

import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Button, SvgIcon, Typography} from '@material-ui/core';

import CurrencyOption from './CurrencyOption';
import {useStyles} from './ExclusiveCreate.styles';
import {InputAmount} from './InputAmount';

import {serialize} from 'components/PostCreate/formatter';
import {checkEditor, Editor, getEditorSelectors} from 'components/common/Editor';
import {TermOfService} from 'components/common/TermOfService';
import {Currency} from 'src/interfaces/currency';
import {ExclusiveContentPost} from 'src/interfaces/exclusive';
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
    post: ExclusiveContentPost,
    attributes?: Pick<Post, 'NSFWTag' | 'visibility'>,
  ) => void;
};

export const ExclusiveCreate: React.FC<PostCreateProps> = props => {
  const {user, isMobile, onSearchPeople, onSubmit} = props;
  const styles = useStyles();
  const [currency, setCurrency] = useState<Currency>();
  const [amount, setAmount] = useState<string>('');
  const [agreementChecked, setAgreementChecked] = useState<boolean>(false);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(true);
  const [isErrorEditor, setIsErrorEditor] = useState<boolean>(false);

  const {filteredCurrencies: balances} = useSelector<RootState, ConfigState>(
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
        content: {
          text: attributes.text,
          rawText: attributes.rawText,
        },

        contentPrices: [
          {
            currencyId: currency.id,
            amount: Number(amount),
          },
        ],
      });
    } else {
      setIsErrorEditor(true);
    }
  };

  useEffect(() => {
    if (agreementChecked && currency && amount !== '') setIsDisabledButton(false);
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
            placeholder={i18n.t('ExclusiveContent.Label.ExclusiveContentPrice')}
            onChange={setAmount}
            decimal={currency?.decimal}
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
          {i18n.t('ExclusiveContent.Label.Attach')}
        </Button>
      </div>
    </>
  );
};

export default ExclusiveCreate;
