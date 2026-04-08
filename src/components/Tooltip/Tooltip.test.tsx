import { Tooltip } from './Tooltip.tsx';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';

const setup = (content = 'Helpful hint') => {
  const user = userEvent.setup();

  const AnchorWithTooltip = () => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    return (
      <>
        <button ref={anchorRef}>Anchor</button>
        <Tooltip content={content} anchorRef={anchorRef} />
      </>
    );
  };

  const renderResult = render(<AnchorWithTooltip />);

  return {
    user,
    anchorEl: screen.getByRole('button'),
    ...renderResult,
  };
};

describe('Tooltip component', () => {
  test('it is not in the DOM by default', () => {
    setup();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('tooltip appears after anchor is hovered', async () => {
    const { user, anchorEl } = setup();
    await user.hover(anchorEl);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    expect(screen.getByText('Helpful hint')).toBeInTheDocument();
  });

  test('tooltip renders into document.body via a portal', async () => {
    const { user, anchorEl, container } = setup();
    await user.hover(anchorEl);

    const tooltip = await screen.findByRole('tooltip');
    expect(document.body).toContainElement(tooltip);
    expect(container).not.toContainElement(tooltip);
  });

  test('renders the content string passed to it', async () => {
    const { user, anchorEl } = setup('This is my tooltip');
    await user.hover(anchorEl);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('This is my tooltip');
  });
});
