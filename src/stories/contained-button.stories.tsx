import {action} from '@storybook/addon-actions';

import React from 'react';

import Button from '@material-ui/core/Button';

export default {
  title: 'UI Revamp v2.0/Button',
};

export const Default = () => (
  <Button onClick={action('Default button clicked')} variant="contained">
    Default
  </Button>
);

export const PrimaryLarge = () => (
  <Button
    color="primary"
    onClick={action('Primary button clicked')}
    variant="contained"
    size="large">
    Primary Large
  </Button>
);

export const Secondary = () => (
  <Button color="secondary" onClick={action('Secondary button clicked')} variant="contained">
    Secondary
  </Button>
);
