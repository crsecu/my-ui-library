export type TooltipPositionType = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAlignmentType = 'start' | 'center' | 'end';

export type AvailableSpaceAroundAnchor = { [key in TooltipPositionType]: number };

export type PositionIsValidType = { [key in TooltipPositionType]: boolean };
export type PositionCoordinatesType = { [key in TooltipPositionType]: number };
export type AlignmentIsValidType = { [key in TooltipAlignmentType]: boolean };
export type AlignmentCoordinatesType = { [key in TooltipAlignmentType]: number };

export type TooltipCoords = {
  top: number | undefined;
  left: number | undefined;
};

export type UseTooltipReturn = {
  isVisible: boolean;
  tooltipStyles: TooltipCoords;
};
