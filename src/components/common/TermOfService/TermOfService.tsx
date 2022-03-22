import React, {useState} from 'react';

import {Checkbox, FormControlLabel, Link, Typography} from '@material-ui/core';

import ShowIf from '../show-if.component';
import {useStyles} from './TermOfService.style';

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
        <Typography variant="subtitle2">
          I agree to the Myriad&nbsp;
          <Link href="/term-of-use" target="_blank" rel="noreferrer" className={styles.link}>
            Terms of Service
          </Link>
          &nbsp;
          <ShowIf condition={Boolean(about)}>about {about}</ShowIf>
        </Typography>
      }
    />
  );
};
