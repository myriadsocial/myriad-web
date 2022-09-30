import {render, screen} from '@testing-library/react';

import singletonRouter from 'next/router';

import {MenuContainer} from './Menu.container';

jest.mock('next/router', () => require('next-router-mock'));

describe('Menu Container', () => {
  const logo =
    'https://firebasestorage.googleapis.com/v0/b/myriad-social-mainnet.appspot.com/o/assets%2Flogo_myriad.svg?alt=media&token=9be4d7a6-0a54-4fb3-bab8-1da47343409a';

  it('render menu container', () => {
    singletonRouter.push('/');
    render(<MenuContainer logo={logo} />);
    const renderComponentMenu = screen.getByTestId(`menu-container-test`);
    expect(renderComponentMenu).toBeInTheDocument();
    const renderComponentSelected = screen.getByTestId('list-item-icon-Home');
    expect(renderComponentSelected.getAttribute('class')).toMatch(/active/);
  });

  it('render menu container with change router', () => {
    singletonRouter.push('/');
    singletonRouter.push('/friends');
    render(<MenuContainer logo={logo} />);
    const renderComponentMenu = screen.getByTestId(`menu-container-test`);
    expect(renderComponentMenu).toBeInTheDocument();
    const renderComponentSelected = screen.getByTestId('list-item-icon-Friends');
    expect(renderComponentSelected.getAttribute('class')).toMatch(/active/);
  });
});
