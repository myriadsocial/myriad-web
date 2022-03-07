import React from 'react';
import { setConfig } from 'next/config';
import {ThemeProvider, StylesProvider} from '@material-ui/styles';
import {ThemeProvider as StyledThemeProvider} from 'styled-components';


import LightTheme from 'src/themes/light-theme';

setConfig({ publicRuntimeConfig: {
  appEnvironment: 'local',
  appName: `Myriad Storybook`,
  appVersion: `1.0.0`,
  appAuthURL: 'http://localhost:3000',
  myriadWebsiteURL: 'https://www.myriad.social',
  myriadSupportMail: 'support@myriad.social',
  storageBucket: 'myriad-social-development',
} });

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
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#E5E5E5',
      },
      {
        name: 'dark',
        value: '#121212',
      },
    ],
  },
};

