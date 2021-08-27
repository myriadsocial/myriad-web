/**
 * @jest-environment jsdom
 */
// Using render and screen from test-utils.js instead of
// @testing-library/react
// import { render, screen } from "../test-utils";
import {render, screen} from '@testing-library/react';

import React from 'react';

import HomePage from '../pages/coba';

describe('HomePage', () => {
  it('should render the heading', () => {
    render(<HomePage />);

    const heading = screen.getByText(/Testing Next.js With Jest and React Testing Library/i);

    // we can only use toBeInTheDocument because it was imported
    // in the jest.setup.js and configured in jest.config.js
    expect(heading).toBeInTheDocument();
  });
});
