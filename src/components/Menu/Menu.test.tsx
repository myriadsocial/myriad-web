import {render, screen} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';

import {Menu} from './Menu';
import {useMenuList, MenuId} from './use-menu-list';

describe('Menu Component', () => {
  const selected: MenuId = 'home';
  const {result: resultMenu} = renderHook(() => useMenuList(selected));
  const logo =
    'https://firebasestorage.googleapis.com/v0/b/myriad-social-mainnet.appspot.com/o/assets%2Flogo_myriad.svg?alt=media&token=9be4d7a6-0a54-4fb3-bab8-1da47343409a';
  const mockFunction = jest.fn(() => console.info('item clicked'));

  it('render list item', () => {
    render(<Menu selected={selected} onChange={mockFunction} logo={logo} />);
    const renderMenuComponent = screen.getByTestId('menu-test');
    const renderComponentHome = screen.getByTestId(`list-item-${resultMenu.current[0].title}`);
    expect(renderMenuComponent).toBeInTheDocument();
    expect(renderComponentHome).toBeInTheDocument();
    expect(renderComponentHome).toContainHTML('ListItemIcon');
  });

  it('render list item with animation', () => {
    render(<Menu selected={selected} onChange={mockFunction} logo={logo} />);
    const renderComponentAnimation = screen.getByTestId(
      `list-item-${resultMenu.current.filter(ar => ar.isAnimated === true)[0].title}`,
    );
    expect(renderComponentAnimation).toBeInTheDocument();
    expect(renderComponentAnimation).toContainHTML('ListItemIcon');
    expect(renderComponentAnimation).toContainHTML('img');
  });

  it('render list item with selected menu', () => {
    render(<Menu selected={selected} onChange={mockFunction} logo={logo} />);
    const renderComponentSelected = screen.getByTestId(
      `list-item-icon-${resultMenu.current.filter(ar => ar.id === selected)[0].title}`,
    );
    expect(renderComponentSelected).toBeInTheDocument();
    expect(renderComponentSelected.getAttribute('class')).toMatch(/active/);
  });

  it.todo('render list with change menu onclick');
});
