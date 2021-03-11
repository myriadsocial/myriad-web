import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import theme from '../../themes/default';

const useStyles = makeStyles({
  root: {
    width: 120,
    marginTop: theme.spacing(1)
  },
  label: {
    fontSize: 12,
    margin: 0
  }
});

type Props = {
  settings: any;
  onChange: (key, value) => void;
};

const SettingComponent = ({ onChange, settings }: Props) => {
  const styles = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.name, event.target.checked);
  };

  return (
    <div className={styles.root}>
      <FormGroup>
        <FormControlLabel
          className={styles.label}
          control={<Switch size="small" checked={settings.people} onChange={handleChange} color="primary" name="people" />}
          label="Show People"
        />
        <FormControlLabel
          className={styles.label}
          control={<Switch size="small" checked={settings.topic} onChange={handleChange} color="primary" name="topic" />}
          label="Show Topic"
        />
        <FormControlLabel
          className={styles.label}
          control={<Switch size="small" checked={settings.focus} onChange={handleChange} color="primary" name="focus" />}
          label="Focus Mode"
        />
      </FormGroup>
    </div>
  );
};

export default SettingComponent;
