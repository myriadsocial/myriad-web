import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import {makeStyles} from '@material-ui/core/styles';

import theme from '../../themes/default';

import {LayoutFilterType} from 'src/interfaces/setting';

const useStyles = makeStyles({
  root: {
    width: 120,
    marginTop: theme.spacing(1),
  },
  label: {
    fontSize: 12,
    margin: 0,
  },
});

type Props = {
  settings: Record<LayoutFilterType, boolean>;
  onChange: (key: LayoutFilterType, value: boolean) => void;
};

const SettingComponent = ({onChange, settings}: Props) => {
  const styles = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name as LayoutFilterType;

    onChange(key, event.target.checked);
  };

  return (
    <div className={styles.root}>
      <FormGroup>
        <FormControlLabel
          className={styles.label}
          control={
            <Switch
              size="small"
              disabled={!settings.topic && settings.people}
              checked={settings.people}
              onChange={handleChange}
              color="primary"
              name="people"
            />
          }
          label="Show People"
        />
        <FormControlLabel
          className={styles.label}
          control={
            <Switch
              size="small"
              disabled={!settings.people && settings.topic}
              checked={settings.topic}
              onChange={handleChange}
              color="primary"
              name="topic"
            />
          }
          label="Show Topic"
        />
        <FormControlLabel
          className={styles.label}
          control={
            <Switch
              size="small"
              checked={settings.focus}
              onChange={handleChange}
              color="primary"
              name="focus"
            />
          }
          label="Focus Mode"
        />
      </FormGroup>
    </div>
  );
};

export default SettingComponent;
