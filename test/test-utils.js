// test-utils.js
import {render} from '@testing-library/react';

// Add in any providers here if necessary:
// (ReduxProvider, ThemeProvider, etc)
const Providers = ({children}) => {
  return children;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const customRender = (ui, options = {}) => render(ui, {wrapper: Providers, ...options});

// re-export everything
export * from '@testing-library/react';

// override render method
export {customRender as render};
