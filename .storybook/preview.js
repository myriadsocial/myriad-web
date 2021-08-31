import React from 'react';

import {ThemeProvider, StylesProvider} from '@material-ui/styles';
import {ThemeProvider as StyledThemeProvider} from 'styled-components';


import LightTheme from '../src/themes/light-theme-v2';

// Global decorator to apply the styles to all stories
export const decorators = [
  Story => (
    <>
      <StylesProvider injectFirst>
        <StyledThemeProvider theme={LightTheme}>
          <ThemeProvider theme={LightTheme}>
            <Story />
          </ThemeProvider>
        </StyledThemeProvider>
      </StylesProvider>
    </>
  ),
];

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

