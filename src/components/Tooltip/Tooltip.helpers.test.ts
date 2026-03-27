import type { AlignmentIsValidType, AvailableSpaceAroundAnchor, PositionIsValidType } from './Tooltip.types.ts';
import {
  determineAlignment,
  determinePosition, determineTooltipPlacement,
  generateAlignmentCoordinates,
  resolveTooltipPlacement,
} from './Tooltip.helpers.ts';
import { roundTo } from '../../utils/roundNum.tsx';
//this test file contains test suites for all tooltip helpers

//1. resolveTooltipPlacement helper function
describe('resolveTooltipPlacement helper', () => {
  test("resolves to 'bottom'", () => {
    const placementIsValid: PositionIsValidType = {
      top: false,
      bottom: true,
      right: true,
      left: false,
    };

    expect(resolveTooltipPlacement(placementIsValid)).toBe('bottom');
  });

  test("resolves to 'top'", () => {
    const placementIsValid: PositionIsValidType = {
      top: true,
      bottom: true,
      right: true,
      left: true,
    };

    expect(resolveTooltipPlacement(placementIsValid)).toBe('top');
  });

  test('resolves undefined (no valid placement found)', () => {
    const placementIsValid: PositionIsValidType = {
      top: false,
      bottom: false,
      right: false,
      left: false,
    };

    expect(resolveTooltipPlacement(placementIsValid)).toBe(undefined);
  });

  test("resolves to 'center'", () => {
    const alignmentIsValid: AlignmentIsValidType = {
      start: false,
      center: true,
      end: true,
    };

    expect(resolveTooltipPlacement(alignmentIsValid)).toBe('center');
  });
});

//generateAlignmentCoordinates helper function
describe('generateAlignmentCoordinates helper', () => {
  const mockAnchorRect = new DOMRect(0, 99.99, 89.88, 43.11);
  const mockTooltipRect = new DOMRect(0, 813.75, 349.99, 154.38);


  test('computes alignment coordinates for horizontally positioned tooltip', () => {
    const isTooltipPositionedVertically = false;
    const result = generateAlignmentCoordinates(isTooltipPositionedVertically, mockAnchorRect, mockTooltipRect);

    expect(roundTo(result.start)).toBe(99.99);
    expect(roundTo(result.center)).toBe(44.35);
    expect(roundTo(result.end)).toBe(-11.28);
  });

  test('computes alignment coordinates for vertically positioned tooltip', () => {
    const isTooltipPositionedVertically = true;
    const result = generateAlignmentCoordinates(isTooltipPositionedVertically, mockAnchorRect, mockTooltipRect);

    expect(result.start).toBe(0);
    expect(roundTo(result.center)).toBe(-130.06);
    expect(roundTo(result.end)).toBe(-260.11);
  });
});

//determinePosition helper function
describe('determinePosition helper', () => {
  const tooltipHeight = 154.38;
  const tooltipWidth = 349.99;
  const tooltipOffset = 6;

  test("tooltip position is 'right'", () => {
    const preferredPosition = 'top';
    const availableSpaceAroundAnchor: AvailableSpaceAroundAnchor = {
      top: 99.99,
      bottom: 119.89,
      right: 515.37,
      left: 39.75,
    };

    const position = determinePosition(
      preferredPosition,
      availableSpaceAroundAnchor,
      tooltipHeight,
      tooltipWidth,
      tooltipOffset,
    );
    expect(position).toBe('right');
  });

  test('tooltip position is preferredPosition', () => {
    const preferredPosition = 'right';
    const availableSpaceAroundAnchor: AvailableSpaceAroundAnchor = {
      top: 99.99,
      bottom: 201.88,
      right: 1067.67,
      left: 591.43,
    };

    const position = determinePosition(
      preferredPosition,
      availableSpaceAroundAnchor,
      tooltipHeight,
      tooltipWidth,
      tooltipOffset,
    );
    expect(position).toBe('right');
  });

  test("tooltip position is 'top'", () => {
    const preferredPosition = 'bottom';
    const availableSpaceAroundAnchor: AvailableSpaceAroundAnchor = {
      top: 299.99,
      bottom: 1.88,
      right: 1067.67,
      left: 591.43,
    };

    const position = determinePosition(
      preferredPosition,
      availableSpaceAroundAnchor,
      tooltipHeight,
      tooltipWidth,
      tooltipOffset,
    );
    expect(position).toBe('top');
  });

  //write test for fallback positioning when not enough space exists for tooltip to
  // fit fully on viewport

  describe('determineAlignment helper', () => {
    test("tooltip validated alignment is 'start'", () => {
      const preferredAlignment = 'start';
      const availabeSpaceAroundTheAnchor = {
        top: 99.99,
        bottom: 288.88,
        right: 642.22,
        left: 165.89,
      };
      const tooltipHeight = 154.38;
      const tooltipWidth = 349.99;
      const anchorHeight = 43.11;
      const anchorWidth = 89.88;

      const result = determineAlignment(
        preferredAlignment,
        true,
        availabeSpaceAroundTheAnchor,
        tooltipHeight,
        tooltipWidth,
        anchorHeight,
        anchorWidth,
      );
      expect(result).toBe('start');
    });

    test("tooltip validated alignment is 'center'", () => {
      const preferredAlignment = 'end';
      const availabeSpaceAroundTheAnchor = {
        top: 99.99,
        bottom: 89.88,
        right: 642.22,
        left: 165.89,
      };
      const tooltipHeight = 154.38;
      const tooltipWidth = 349.99;
      const anchorHeight = 43.11;
      const anchorWidth = 89.88;

      const result = determineAlignment(
        preferredAlignment,
        false,
        availabeSpaceAroundTheAnchor,
        tooltipHeight,
        tooltipWidth,
        anchorHeight,
        anchorWidth,
      );

      expect(result).toBe('center');
    });

    test("tooltip validated alignment is preferredAlignment", () => {
      const preferredAlignment = 'end';
      const availabeSpaceAroundTheAnchor = {
        top: 299.99,
        bottom: 47.88,
        right: 1067.67,
        left: 591.43,
      };
      const tooltipHeight = 154.38;
      const tooltipWidth = 349.99;
      const anchorHeight = 43.11;
      const anchorWidth = 89.88;

      const result = determineAlignment(
        preferredAlignment,
        true,
        availabeSpaceAroundTheAnchor,
        tooltipHeight,
        tooltipWidth,
        anchorHeight,
        anchorWidth,
      );

      expect(result).toBe('end');
    });
  });
});


describe("determineTooltipPlacement output for large tooltip", () => {
  const mockAnchorRect = new DOMRect(1039.63, 299.99, 146.94, 43.11);
  const mockTooltipRect = new DOMRect(0, 428.05, 349.99, 70.39);
  const vh = 428;
  const vw = 1749;

  test("returns coordinates that place tooltip on top of anchor (center alignment)", () => {
  const result = determineTooltipPlacement(mockTooltipRect, mockAnchorRect, vh, vw)
  expect(roundTo(result.top)).toBe(223.60);
  expect(roundTo(result.left)).toBe(938.11);
  })

  test('returns coordinates that place tooltip below anchor (end alignment)', () => {
    const preferredPosition = 'bottom';
    const preferredAlignment = 'end';
    const result = determineTooltipPlacement(mockTooltipRect, mockAnchorRect, vh, vw, preferredPosition, preferredAlignment);
    expect(roundTo(result.top)).toBe(349.10);
    expect(roundTo(result.left)).toBe(836.58);
  });
})

describe("determineTooltipPlacement output for small tooltip", () => {
  const mockAnchorRect = new DOMRect(307.95, 9.99, 92.51, 43.11);
  const mockTooltipRect = new DOMRect(0, 463.57, 52.23, 36.79);
  const vh = 463;
  const vw = 1003;


  test('returns coordinates that place tooltip below anchor (center alignment)', () => {
   const result = determineTooltipPlacement(mockTooltipRect, mockAnchorRect, vh, vw);

    expect(roundTo(result.top)).toBe(59.10);
    expect(roundTo(result.left)).toBe(328.09);
  });

  test('returns coordinates that place tooltip above anchor (start alignment)', () => {
    const mockAnchorRect = new DOMRect(0, 99.99, 92.51, 43.11);
    const mockTooltipRect = new DOMRect(0, 216.23, 52.23, 36.79);
    const vh = 166;
    const vw = 538;
    const preferredPosition = 'bottom';
    const preferredAlignment = 'start';

    const result = determineTooltipPlacement(mockTooltipRect, mockAnchorRect, vh, vw, preferredPosition, preferredAlignment);
    console.log(100, result);

    expect(roundTo(result.top)).toBe(57.20);
    expect(roundTo(result.left)).toBe(0);
  });


})
