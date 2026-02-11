import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

describe('Tooltip component', () => {
  const tooltipContent = 'Some information';
  const buttonText = 'Hover over me';

  test('tooltip is hidden by default', () => {
    render(
      <Tooltip content={tooltipContent}>
        <button>{buttonText}</button>
      </Tooltip>,
    );

    expect(screen.queryByText(tooltipContent)).not.toBeInTheDocument();
  });

  test('tooltip renders its children', () => {
    render(
      <Tooltip>
        <button>{buttonText}</button>
      </Tooltip>,
    );

    expect(
      screen.getByRole('button', { name: buttonText }),
    ).toBeInTheDocument();
  });

  test('tooltip does not render without text', () => {
    render(
      <Tooltip>
        <button>{buttonText}</button>
      </Tooltip>,
    );

    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  test('tooltip content becomes visible on hover', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content={tooltipContent}>
        <button>{buttonText}</button>
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: buttonText }));
    expect(screen.getByText(tooltipContent)).toBeInTheDocument();
  });

  test('tooltip content becomes hidden when hovering out', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content={tooltipContent}>
        <button>{buttonText}</button>
      </Tooltip>,
    );

    await user.unhover(screen.getByRole('button', { name: buttonText }));
    expect(screen.queryByText(tooltipContent)).not.toBeInTheDocument();
  });

  test('tooltip content becomes visible when the button element receives focus', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <input type="checkbox" />
        <Tooltip content={tooltipContent}>
          <button>{buttonText}</button>
        </Tooltip>
      </div>,
    );

    expect(document.body).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  test('tooltip content becomes hidden when the button element looses focus', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Tooltip content={tooltipContent}>
          <button>{buttonText}</button>
        </Tooltip>
        <input type="checkbox" />
      </div>,
    );

    expect(document.body).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();
  });
});

/* We want to verify that the component behaves correctly when the user interacts with it (the content appears and dissapears as espected)

We need to think of different states that the component can be in:
1. initial state: is the component hidden by default?
2. interaction: does it appear when the mouse enters the wrapper?
3. accessibility: does it appear when a user tabs into it (focus)?
4. edge case: what happens if the content prop is missing?

*/
