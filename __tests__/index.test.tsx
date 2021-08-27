/**
 * @jest-environment jsdom
 */
import {render, screen} from '@testing-library/react';

import React from 'react';

import Home from '../pages/coba';

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /Hallo/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
