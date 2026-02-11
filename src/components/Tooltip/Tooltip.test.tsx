import { render, screen } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip component', () => {
  const tooltipContent = 'Some information';
  const buttonText = 'Hover over me';

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

  test('tooltip is hidden by default', () => {
    render(
      <Tooltip content={tooltipContent}>
        <button>{buttonText}</button>
      </Tooltip>,
    );

    expect(screen.queryByText(tooltipContent)).not.toBeInTheDocument();
  });

  test('tooltip becomes visible on hover', async () => {
    render(
      <Tooltip>
        <button>{buttonText}</button>
      </Tooltip>,
    );
  });
});

/* We want to verify that the component behaves correctly when the user interacts with it (the content appears and dissapears as espected)

Need to think of different states that the component can be in:
1. initial state: is the component hidden by default?
2. interaction: does it appear when the mouse enters the wrapper?
3. accessibility: does it appear when a user tabs into it (focus)?
4. edge case: what happens if the content prop is missing?

*/
