import type {
  AlignmentData,
  AlignmentIsValidType,
  LayoutAxisType,
  PositionCoordinatesType,
  PositionIsValidType,
  TooltipAlignType,
  TooltipPositionType,
} from './tooltip.types';

//determine fallback placement if desired position/aligment doesn't fit on viewport
const rezolveTooltipPlacement = <T extends PositionIsValidType | AlignmentIsValidType>(placementIsValid: T) => {
  const placementOptions = Object.keys(placementIsValid) as (keyof T)[];

  return placementOptions.find((placement) => placementIsValid[placement]);
  //what should happen if .find doesn't find a match?
};

//determines if tooltip fits in the selected position
export const determineTooltipPlacement = (
  tooltipRect: DOMRect,
  anchorRect: DOMRect,
  vh: number,
  vw: number,
  position: TooltipPositionType = 'top',
  align: TooltipAlignType = 'center',
) => {
  const tooltipHeight = tooltipRect.height;
  const tooltipWidth = tooltipRect.width;

  const positionIsValid: PositionIsValidType = {
    top: anchorRect.top - tooltipHeight > 0,
    bottom: anchorRect.bottom + tooltipHeight < vh,
    right: anchorRect.right + tooltipWidth < vw,
    left: anchorRect.left - tooltipWidth > 0,
  };

  const positionCoordinates: PositionCoordinatesType = {
    top: anchorRect.top - tooltipHeight,
    bottom: anchorRect.bottom,
    right: anchorRect.right,
    left: anchorRect.left - tooltipWidth,
  };

  const resolvedPosition: TooltipPositionType = positionIsValid[position]
    ? position
    : (rezolveTooltipPlacement(positionIsValid) ?? position);

  const primaryAxis = resolvedPosition === 'top' || resolvedPosition === 'bottom' ? 'y' : 'x';

  const { alignmentIsValid, alignmentCoordinates } = generateAlignmentData(
    anchorRect,
    tooltipRect,
    primaryAxis,
    vh,
    vw,
  );

  const resolvedAlignment: TooltipAlignType = alignmentIsValid[align]
    ? align
    : (rezolveTooltipPlacement(alignmentIsValid) ?? align);

  const cssPropertyPrimary = primaryAxis === 'y' ? 'top' : 'left';
  const cssPropertySecondary = cssPropertyPrimary === 'top' ? 'left' : 'top';

  return {
    [cssPropertyPrimary]: positionCoordinates[resolvedPosition],
    [cssPropertySecondary]: alignmentCoordinates[resolvedAlignment],
  };
};

//Alignment Data
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

  const alignmentCoordinates = {
    start: anchorRect[anchorStart],
    center: anchorRect[anchorStart] + anchorMiddle - tooltipMiddle,
    end: anchorRect[anchorEnd] - tooltipRect[axisDimension],
  };

  const alignmentIsValid = {
    start: anchorRect[anchorStart] + tooltipRect[axisDimension] < viewportDimension,
    center:
      anchorRect[anchorStart] + anchorMiddle - tooltipMiddle > 0 && tooltipRect[axisDimension] <= viewportDimension,
    end: anchorRect[anchorEnd] + tooltipRect[axisDimension] > 0,
  };

  return { alignmentCoordinates, alignmentIsValid };
};
