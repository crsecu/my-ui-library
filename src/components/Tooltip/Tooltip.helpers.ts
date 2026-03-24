import type {
  AlignmentCoordinatesType,
  AlignmentData,
  AlignmentIsValidType,
  LayoutAxisType,
  PositionCoordinatesType,
  PositionIsValidType,
  TooltipAlignmentType,
  TooltipPositionType,
} from './Tooltip.types.ts';


/**
 * The primary engine for tooltip positioning.
 * Validates if the preferred position and alignment fit within the current viewport boundaries.
 * If not, it then calculates the optimal x/y coordinates for the tooltip relative to its anchor, ensuring the tooltip stays
 * within the viewport boundaries.
 * @param tooltipRect - The size and position of the tooltip element.
 * @param anchorRect - The size and position of the anchor (the element the tooltip is attached to).
 * @param vh -Total height of the visible screen.
 * @param vw - Total width of the visible screen.
 * @param position - The preferred side (top, bottom, left, right).
 * @param align - The preferred alignment on the opposite axis (start, center, end).
 * @returns An object containing the final `top` and `left` pixel coordinates.
 */
export const determineTooltipPlacement = (
  tooltipRect: DOMRect,
  anchorRect: DOMRect,
  vh: number,
  vw: number,
  position: TooltipPositionType = 'top',
  align: TooltipAlignmentType = 'center',
) => {
  const tooltipHeight = tooltipRect.height;
  const tooltipWidth = tooltipRect.width;
  const tooltipOffset = 6;

  const positionIsValid: PositionIsValidType = {
    top: anchorRect.top - tooltipHeight - tooltipOffset > 0,
    bottom: anchorRect.bottom + tooltipHeight + tooltipOffset < vh,
    right: anchorRect.right + tooltipWidth + tooltipOffset < vw,
    left: anchorRect.left - tooltipWidth > 0 - tooltipOffset,
  };

  const positionCoordinates: PositionCoordinatesType = {
    top: anchorRect.top - tooltipHeight - tooltipOffset,
    bottom: anchorRect.bottom + tooltipOffset,
    right: anchorRect.right + tooltipOffset,
    left: anchorRect.left - tooltipWidth - tooltipOffset,
  };

  const resolvedPosition: TooltipPositionType = positionIsValid[position]
    ? position
    : rezolveTooltipPlacement(positionIsValid, positionCoordinates);

  const primaryAxis = resolvedPosition === 'top' || resolvedPosition === 'bottom' ? 'y' : 'x';

  const { alignmentIsValid, alignmentCoordinates } = generateAlignmentData(
    anchorRect,
    tooltipRect,
    primaryAxis,
    vh,
    vw,
  );

  console.log(
    'positionCoords ',
    positionCoordinates,
    'positionIsValid ',
    positionIsValid,
    'alignmentIsValid',
    alignmentIsValid,
    'alignmentCoords ',
    alignmentCoordinates,
    vh,
  );

  const cssPropertyPrimary = primaryAxis === 'y' ? 'top' : 'left';
  const cssPropertySecondary = cssPropertyPrimary === 'top' ? 'left' : 'top';

  const resolvedAlignment= alignmentIsValid[align]
    ? align
    : rezolveTooltipPlacement(alignmentIsValid, alignmentCoordinates);

  return {
    [cssPropertyPrimary]: positionCoordinates[resolvedPosition],
    [cssPropertySecondary]: alignmentCoordinates[resolvedAlignment],
  };
};

/**
 * Utility function that selects the first available placement that fits within the viewport.
 * It's used as a fallback to determine Tooltip placement if there is not enough space for the preferred spot.
 * @param placementIsValid - A map of placement keys (e.g., 'top', 'start') to booleans indicating if Tooltip fits at
 * that placement
 * @param placementCoordinates - A map of placement keys (e.g., 'top', 'start') to numeric pixel values
 * @returns The first key that is `true`; if none is true (Tooltip does not fully fit on viewport), it returns the placement
 * with most available space
 */
const rezolveTooltipPlacement = <T extends PositionIsValidType | AlignmentIsValidType, U extends PositionCoordinatesType | AlignmentCoordinatesType>(
  placementIsValid: T,
  placementCoordinates: U
): keyof T => {
  const placementOptions = Object.keys(placementIsValid) as (keyof T)[];
  const suitablePlacement = placementOptions.find((placement) => placementIsValid[placement]);

  //if no suitable placement (tooltip does not fit fully) exists, use the placement
  //with most space as a fallback
  if (!suitablePlacement) {
    let maxSpace = 0;
    let fallbackPlacement = '';

    for (const placement in placementCoordinates) {
      const pixelCoords = +placementCoordinates[placement];
      if (pixelCoords < 0) break;

      if (pixelCoords > maxSpace) {
        maxSpace = pixelCoords;
        fallbackPlacement = placement;
      }
    }

    return fallbackPlacement as keyof T;
  }

  return suitablePlacement;
};

/**
 * Calculates whether a tooltip can align to the start, center, or end of its anchor based on
 * the current available space on the "secondary" axis.
 * @param anchorRect - The size and position of the anchor (the element the tooltip is attached to).
 * @param tooltipRect - The size and position of the tooltip element.
 * @param primaryAxis - The axis of the main position ('y' for top/bottom, 'x' for left/right).
 * @param viewportHeight - Total height of the visible screen.
 * @param viewportWidth - Total width of the visible screen.
 * @returns {AlignmentData} An object containing:
 * - alignmentCoordinates: The specific pixel values for each alignment option.
 * - alignmentIsValid: Booleans indicating if each option fits in the viewport.
 */
const generateAlignmentData = (
  anchorRect: DOMRect,
  tooltipRect: DOMRect,
  primaryAxis: LayoutAxisType,
  viewportHeight: number,
  viewportWidth: number,
): AlignmentData => {
  const anchorStart = primaryAxis === 'y' ? 'left' : 'top';
  const anchorEnd = primaryAxis === 'y' ? 'right' : 'bottom';
  const axisDimension = primaryAxis === 'y' ? 'width' : 'height';
  const viewportDimension = primaryAxis === 'y' ? viewportWidth : viewportHeight;
  const anchorMiddle = anchorRect[axisDimension] / 2;
  const tooltipMiddle = tooltipRect[axisDimension] / 2;

  const alignmentIsValid = {
    start: anchorRect[anchorStart] + tooltipRect[axisDimension] < viewportDimension,
    center:
      anchorRect[anchorStart] + anchorMiddle - tooltipMiddle > 0 && tooltipRect[axisDimension] <= viewportDimension,
    end: anchorRect[anchorEnd] - tooltipRect[axisDimension] > 0,
  };

  const alignmentCoordinates = {
    start: anchorRect[anchorStart],
    center: anchorRect[anchorStart] + anchorMiddle - tooltipMiddle,
    end: anchorRect[anchorEnd] - tooltipRect[axisDimension],
  };

  return { alignmentCoordinates, alignmentIsValid };
};
