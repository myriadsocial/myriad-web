/**
 * @jest-environment jsdom
 */
import {render, screen, fireEvent} from '@testing-library/react';

import React from 'react';

import Banner from 'src/components/common/banner-demo.component';

describe('Banner demo test', () => {
  it('renders a banner text', () => {
    render(<Banner />);
    // used when text within multiple elements
    const bannerDemoText = screen.getByText((content: string, node: any) => {
      const hasText = (node: any) =>
        node.textContent ===
        'You’re on Myriad Demo v1.0.0 right now, not audited, use at your own risk!';
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));

      return nodeHasText && childrenDontHaveText;
    });

    expect(bannerDemoText).toBeInTheDocument();
  });

  it('renders a modal after click the demo', () => {
    render(<Banner />);
    // used when test need action
    fireEvent.click(screen.getByTestId('show-banner'));

    const titleText = screen.getByText('Myriad version');
    const caption = screen.getByText('Great Things Take Time');
    const telegramButton = screen.getByText('Telegram channel').closest('a');

    expect(titleText).toBeInTheDocument();
    expect(caption).toBeInTheDocument();

    // check anchor's href
    expect(telegramButton).toHaveAttribute('href', 'https://t.me/myriadsocial');
    // or
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://t.me/myriadsocial');
  });
});
