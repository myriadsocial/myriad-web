import React, {useState} from 'react';

import {Checkbox, FormControlLabel, Link, Typography} from '@material-ui/core';

import ShowIf from '../show-if.component';
import {useStyles} from './TermOfService.style';

import i18n from 'src/locale';

type TermOfServiceProps = {
  about?: React.ReactNode;
  onChange: (accepted: boolean) => void;
};

export const TermOfService: React.FC<TermOfServiceProps> = props => {
  const {about, onChange} = props;

  const styles = useStyles();

  const [accepted, setAccepted] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccepted(event.target.checked);

    onChange(event.target.checked);
  };

  return (
    <FormControlLabel
      className={styles.root}
      control={
        <Checkbox
          className={styles.checkBox}
          checked={accepted}
          onChange={handleChange}
          name="check-tipping-agreement"
          color="primary"
        />
      }
      label={
        <Typography variant="subtitle2" className={styles.text}>
          {i18n.t('TOS.Text_1')}
          <Link
            component="span"
            href="/term-of-use"
            target="_blank"
            rel="noreferrer"
            className={styles.link}>
            {i18n.t('TOS.Text_2')}
          </Link>
          <ShowIf condition={Boolean(about)}>{i18n.t('TOS.Text_3', {about: about})}</ShowIf>
        </Typography>
      }
    />
  );
};
