import {action} from '@storybook/addon-actions';

import React from 'react';

import StyledButton from '../../src/components-v2/button';

export default {
  title: 'Styled Button',
};

export const Default = () => (
  <StyledButton onClick={action('Styled button clicked')}>Styled Button</StyledButton>
);
