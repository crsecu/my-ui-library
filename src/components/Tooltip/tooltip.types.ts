export type TooltipPositionType = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAlignType = 'start' | 'center' | 'end';
export type LayoutAxisType = 'x' | 'y';

export type PositionIsValidType = { [key in TooltipPositionType]: boolean };
export type PositionCoordinatesType = { [key in TooltipPositionType]: number };
export type AlignmentIsValidType = { [key in TooltipAlignType]: boolean };
export type AlignmentCoordinatesType = { [key in TooltipAlignType]: number };
export type AlignmentData = { alignmentIsValid: AlignmentIsValidType; alignmentCoordinates: AlignmentCoordinatesType };

export type TooltipCoords = {
  top: number | undefined;
  left: number | undefined;
};

export type UseTooltipReturn = {
  isVisible: boolean;
  tooltipStyles: TooltipCoords;
  showTooltip: () => void;
  hideTooltip: () => void;
  onEscKey: (event: KeyboardEvent) => void;
};
