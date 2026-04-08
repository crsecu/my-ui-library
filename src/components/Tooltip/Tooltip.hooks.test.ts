import { renderHook } from '@testing-library/react';
import { useTooltip } from './Tooltip.hooks.tsx';
import { act } from 'react';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// A helper that sets up the hook with real DOM elements.
const setup = () => {
  const anchorEl = document.createElement('button');
  const tooltipEl = document.createElement('p');
  document.body.appendChild(anchorEl);
  document.body.appendChild(tooltipEl);

  const anchorRef = { current: anchorEl };
  const tooltipRef = { current: tooltipEl };

  const { result, unmount } = renderHook(() => useTooltip({ anchorRef, tooltipRef }));

  // Cleanup DOM after each test
  afterEach(() => {
    anchorEl.remove();
    tooltipEl.remove();
  });

  return { result, anchorEl, unmount };
};

//tests
describe('useTooltip', () => {
  test('should be hidden by default', () => {
    const { result } = setup();
    expect(result.current.isVisible).toBe(false);
  });

  test('should show tooltip after 300ms delay on mouseenter', () => {
    const { result, anchorEl } = setup();

    act(() => {
      anchorEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    expect(result.current.isVisible).toBe(false);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isVisible).toBe(true);
  });

  test('should NOT show tooltip if mouse leaves before 300ms', () => {
    const { result, anchorEl } = setup();

    act(() => {
      anchorEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    act(() => {
      anchorEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.isVisible).toBe(false);
  });

  test('should hide tooltip on blur', () => {
    const { result, anchorEl } = setup();

    act(() => {
      anchorEl.dispatchEvent(new Event('focus'));
      vi.advanceTimersByTime(300);
    });
    expect(result.current.isVisible).toBe(true);

    act(() => {
      anchorEl.dispatchEvent(new Event('blur'));
    });
    expect(result.current.isVisible).toBe(false);
  });

  test('should hide tooltip when Escape key is pressed', () => {
    const { result, anchorEl } = setup();

    act(() => {
      anchorEl.dispatchEvent(new Event('focus'));
      vi.advanceTimersByTime(300);
    });
    expect(result.current.isVisible).toBe(true);

    act(() => {
      anchorEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(result.current.isVisible).toBe(false);
  });

  test('should clear pending timer on unmount', () => {
    const { result, anchorEl, unmount } = setup();

    act(() => {
      anchorEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });

    unmount();

    expect(() => {
      act(() => vi.advanceTimersByTime(300));
    }).not.toThrow();

    expect(result.current.isVisible).toBe(false);
  });
});
