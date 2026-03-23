import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { determineTooltipPlacement } from './helpers';
import type { TooltipAlignmentType, TooltipCoords, TooltipPositionType, UseTooltipReturn } from './tooltip.types';

interface TooltipHookProps {
  anchorRef: RefObject<HTMLElement | null>;
  tooltipRef: RefObject<HTMLParagraphElement | null>;
  selectedPosition?: TooltipPositionType;
  selectedAlign?: TooltipAlignmentType;
}

const initialTooltipPlacement: TooltipCoords = {
  top: undefined,
  left: undefined,
};
/**
 * A custom hook that manages visibility and positioning for Tooltip component.
 * @param anchorRef - The reference to the UI element that triggers the tooltip.
 * @param tooltipRef - The reference to the tooltip element itself, used to measure its dimensions.
 * @param selectedPosition - The preferred side for positioning (e.g., 'top', 'bottom').
 * @param selectedAlign - The preferred edge alignment (e.g., 'start', 'center').
 * @returns An object containing visibility state, and calculated CSS styles (top/left coordinates)
 */
export const useTooltip = ({
  anchorRef,
  tooltipRef,
  selectedPosition,
  selectedAlign,
}: TooltipHookProps): UseTooltipReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPlacement, setTooltipPlacement] = useState<TooltipCoords>(initialTooltipPlacement);

  const timeoutIdRef = useRef<ReturnType<typeof setTimeout>>(null);

  const updateTooltipPlacement = useCallback(() => {
    if (!isVisible || !anchorRef?.current || !tooltipRef?.current) return;

    const vh = window.document.documentElement.clientHeight;
    const vw = window.document.documentElement.clientWidth;
    const anchorRECT = anchorRef.current.getBoundingClientRect();
    const tooltipRECT = tooltipRef.current.getBoundingClientRect();

    const resolvedPlacement = determineTooltipPlacement(
      tooltipRECT,
      anchorRECT,
      vh,
      vw,
      selectedPosition,
      selectedAlign,
    );

    console.log('calculateTooltipPosition RESULT', resolvedPlacement);

    setTooltipPlacement((prevState) => {
      if (prevState.top === resolvedPlacement.top && prevState.left === resolvedPlacement.left) return prevState;

      return { ...prevState, ...resolvedPlacement };
    });

    console.log('tooltip rect', tooltipRECT);
    console.log('anchor rect', anchorRECT);
  }, [anchorRef, tooltipRef, isVisible, selectedAlign, selectedPosition]);

  const showTooltip = useCallback(() => {
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    timeoutIdRef.current = timeoutId;
  }, []);

  const hideTooltip = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    setIsVisible(false);
  }, []);

  const onEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') hideTooltip();
    },
    [hideTooltip],
  );

  //attach event listeners to the anchor
  useEffect(() => {
    if (!anchorRef?.current) return;

    console.log('firstEffect add/hide tooltip event');

    const anchor = anchorRef.current;

    anchor.addEventListener('mouseenter', showTooltip);
    anchor.addEventListener('mouseleave', hideTooltip);
    anchor.addEventListener('focus', showTooltip);
    anchor.addEventListener('blur', hideTooltip);
    anchor.addEventListener('keydown', onEscKey);

    return () => {
      anchor.removeEventListener('mouseenter', showTooltip);
      anchor.removeEventListener('mouseleave', hideTooltip);
      anchor.removeEventListener('focus', showTooltip);
      anchor.removeEventListener('blur', hideTooltip);
      anchor.removeEventListener('keydown', onEscKey);
    };
  }, [anchorRef, hideTooltip, onEscKey, showTooltip]);

  //update tooltip placement before DOM is painted
  useLayoutEffect(() => {
    if (!isVisible) return;

    console.log('useLayout');
    updateTooltipPlacement();
  }, [isVisible, updateTooltipPlacement]);

  //attach resize/scroll event listeners only if the tooltip is visible
  useEffect(() => {
    if (!isVisible) return;

    console.log('resize event firing');

    window.addEventListener('resize', updateTooltipPlacement);
    window.addEventListener('scroll', updateTooltipPlacement);

    return () => {
      window.removeEventListener('resize', updateTooltipPlacement);
      window.removeEventListener('scroll', updateTooltipPlacement);
    };
  }, [isVisible, updateTooltipPlacement]);

  //clear timeout
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  return {
    isVisible,
    tooltipStyles: tooltipPlacement,
  };
};
