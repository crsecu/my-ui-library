import type {
  AlignmentCoordinatesType,
  AlignmentIsValidType,
  AvailableSpaceAroundAnchor,
  PositionCoordinatesType,
  PositionIsValidType,
  TooltipAlignmentType,
  TooltipPositionType,
} from './Tooltip.types.ts';

/**
 * The primary engine for tooltip positioning.
 * It coordinates the calculation of where the tooltip should appear. It first determines the
 * position (relative to anchor: top, bottom, left, right) and then determines the alignment on that side
 * (start, center, end). It then maps these values to actual pixel coordinates.
 * @param tooltipRect - The size and position of the tooltip element.
 * @param anchorRect - The size and position of the anchor (the element the tooltip is attached to).
 * @param vh -Total height of the visible screen.
 * @param vw - Total width of the visible screen.
 * @param preferredPosition - The preferred side (top, bottom, left, right).
 * @param preferredAlignment - The preferred alignment on the opposite axis (start, center, end).
 * @returns An object containing the final `top` and `left` pixel coordinates for CSS positioning.
 */
export const determineTooltipPlacement = (
  tooltipRect: DOMRect,
  anchorRect: DOMRect,
  vh: number,
  vw: number,
  preferredPosition: TooltipPositionType = 'top',
  preferredAlignment: TooltipAlignmentType = 'center',
) => {
  const { height: tooltipHeight, width: tooltipWidth } = tooltipRect;

  //the gap in pixels between the anchor and the tooltip
  const tooltipOffset = 6;

  const availableSpaceAroundAnchor: AvailableSpaceAroundAnchor = {
    top: anchorRect.top,
    bottom: vh - anchorRect.bottom,
    right: vw - anchorRect.right,
    left: anchorRect.left,
  };

  const resolvedPosition: TooltipPositionType = determinePosition(
    preferredPosition,
    availableSpaceAroundAnchor,
    tooltipHeight,
    tooltipWidth,
    tooltipOffset,
  );

  //this refers to tooltip position relative to the anchor
  //evaluates to true if the tooltip is placed above or below anchor, and to false if placed to the left or right of anchor
  const isPositionedVertically = resolvedPosition === 'top' || resolvedPosition === 'bottom';

  const resolvedAlignment = determineAlignment(
    preferredAlignment,
    isPositionedVertically,
    availableSpaceAroundAnchor,
    tooltipHeight,
    tooltipWidth,
    anchorRect.height,
    anchorRect.width,
  );

  const positionCoordinates: PositionCoordinatesType = {
    top: anchorRect.top - tooltipHeight - tooltipOffset,
    bottom: anchorRect.bottom + tooltipOffset,
    right: anchorRect.right + tooltipOffset,
    left: anchorRect.left - tooltipWidth - tooltipOffset,
  };

  const alignmentCoordinates = generateAlignmentCoordinates(isPositionedVertically, anchorRect, tooltipRect);

  const cssPropertyPrimary = isPositionedVertically ? 'top' : 'left';
  const cssPropertySecondary = cssPropertyPrimary === 'top' ? 'left' : 'top';

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
 * @returns The first key that is `true`; if none is true (Tooltip does not fully fit on viewport), it returns undefined
 */
export const resolveTooltipPlacement = <
  T extends PositionIsValidType | AlignmentIsValidType,
>(
  placementIsValid: T,
): keyof T | undefined => {
  const placementOptions = Object.keys(placementIsValid) as (keyof T)[];

  return placementOptions.find((placement) => placementIsValid[placement]);
};

/**
 * Calculates the exact pixel coordinates for start, center, and end alignments.
 * @param isTooltipPositionedVertically - True if tooltip is placed top/bottom; false if left/right.
 * @param anchorRect - The size and position of the anchor (the element the tooltip is attached to).
 * @param tooltipRect - The size and position of the tooltip element.
 * @returns An object containing the specific pixel values for each alignment option.
 */
const generateAlignmentCoordinates = (
  isTooltipPositionedVertically: boolean,
  anchorRect: DOMRect,
  tooltipRect: DOMRect,
): AlignmentCoordinatesType => {
  const anchorStart = isTooltipPositionedVertically ? 'left' : 'top';
  const anchorEnd = isTooltipPositionedVertically ? 'right' : 'bottom';
  const axisDimension = isTooltipPositionedVertically ? 'width' : 'height';
  const anchorMiddle = anchorRect[axisDimension] / 2;
  const tooltipMiddle = tooltipRect[axisDimension] / 2;

  return {
    start: anchorRect[anchorStart],
    center: anchorRect[anchorStart] + anchorMiddle - tooltipMiddle,
    end: anchorRect[anchorEnd] - tooltipRect[axisDimension],
  };
};

/**
 * Determines which side of the anchor the tooltip should appear on.
 * Logic:
 * 1. Checks if the `preferredPosition` fits.
 * 2. If not, finds the first alternative side that fits.
 * 3. If nothing fits, it chooses the side with the most available pixels.
 * @param preferredPosition - The preferred position (top, bottom, left, or right).
 * @param availableSpaceAroundAnchor - Map of available space (pixels) between the anchor and the viewport edges.
 * @param tooltipHeight - Height of the tooltip.
 * @param tooltipWidth - Width of the tooltip.
 * @param tooltipOffset - The gap between the anchor and tooltip.
 * @returns A string (top, bottom, left, or right) representing the validated position for the tooltip.
 */
export const determinePosition = (
  preferredPosition: TooltipPositionType,
  availableSpaceAroundAnchor: AvailableSpaceAroundAnchor,
  tooltipHeight: number,
  tooltipWidth: number,
  tooltipOffset: number
) => {
  const positionIsValid: PositionIsValidType = {
    top: tooltipHeight + tooltipOffset <= availableSpaceAroundAnchor.top,
    bottom: tooltipHeight + tooltipOffset <= availableSpaceAroundAnchor.bottom,
    right: tooltipWidth + tooltipOffset <= availableSpaceAroundAnchor.right,
    left: tooltipWidth + tooltipOffset <= availableSpaceAroundAnchor.left,
  };

  //return the preferred position if it fits within the viewport
  if (positionIsValid[preferredPosition]) return preferredPosition;

  //otherwise, check all other sides and return the first one that fits.
  const positionOptions = Object.keys(positionIsValid) as (keyof PositionIsValidType)[];
  const validPosition = positionOptions.find((position) => positionIsValid[position]);

  //if the tooltip is too large to fit fully on any side, return the side with most available space
  if (!validPosition) {
    let maxSpace = 0;

    //initializing fallbackPosition as first item in PositionOptions to quiet TS
    let fallbackPosition = positionOptions[0];

    for (const position of positionOptions) {
      const availableSpace = availableSpaceAroundAnchor[position];

      if (availableSpace > maxSpace) {
        maxSpace = availableSpace;
        fallbackPosition = position;
      }
    }

    return fallbackPosition;
  }

  return validPosition;
};


/**
 * Determines where to align the tooltip relative to the anchor edge.
 * @param preferredAlignment - The preferred alignment (start, center, or end).
 * @param isTooltipPositionedVertically - True if tooltip is placed top/bottom; false if left/right.
 * @param availableSpaceAroundAnchor - Map of available space (pixels) between the anchor and the viewport edges.
 * @param tooltipHeight - Height of the tooltip.
 * @param tooltipWidth - Width of the tooltip.
 * @param anchorHeight - Height of the anchor element.
 * @param anchorWidth - Width of the anchor element.
 * @returns A string (start, center, end) representing the validated alignment for the tooltip.
 */
export const determineAlignment = (
  preferredAlignment: TooltipAlignmentType,
  isTooltipPositionedVertically: boolean,
  availableSpaceAroundAnchor: { [key in TooltipPositionType]: number },
  tooltipHeight: number,
  tooltipWidth: number,
  anchorHeight: number,
  anchorWidth: number,
) => {
  //return preferredAlignment if tooltip dimension is smaller than anchor since all alignment options will fit by default
  if (tooltipWidth <= anchorWidth || tooltipHeight <= anchorHeight) return preferredAlignment;

  //the extra px the tooltip occupies beyond the anchor edges
  const sizeDiff = isTooltipPositionedVertically ? tooltipWidth - anchorWidth : tooltipHeight - anchorHeight;

  //halfSizeDiff is the space needed on both sides of anchor to allow for 'center' alignment.
  const halfSizeDiff = sizeDiff / 2;

  const alignmentIsValid: AlignmentIsValidType = {
    start: false,
    center: false,
    end: false,
  };

  if (isTooltipPositionedVertically) {
    alignmentIsValid.start = sizeDiff <= availableSpaceAroundAnchor.right;
    alignmentIsValid.center =
      halfSizeDiff <= availableSpaceAroundAnchor.left && halfSizeDiff <= availableSpaceAroundAnchor.right;
    alignmentIsValid.end = sizeDiff <= availableSpaceAroundAnchor.left;
  } else {
    alignmentIsValid.start = sizeDiff <= availableSpaceAroundAnchor.bottom;
    alignmentIsValid.center =
      halfSizeDiff <= availableSpaceAroundAnchor.top && halfSizeDiff <= availableSpaceAroundAnchor.bottom;
    alignmentIsValid.end = sizeDiff <= availableSpaceAroundAnchor.top;
  }

  //return the preferred alignment if it fits within the viewport
  if (alignmentIsValid[preferredAlignment]) return preferredAlignment;

  //if preferred alignment is invalid, find the first alternative that fits, or default to 'start'.
  const alignmentOptions = Object.keys(alignmentIsValid) as (keyof AlignmentIsValidType)[];
  const validAlignment = alignmentOptions.find((alignment) => alignmentIsValid[alignment]);

  return validAlignment || 'start';
};
