//this test file contains test suites for all tooltip helpers

//1. resolveTooltipPlacement helper
import type { PositionCoordinatesType, PositionIsValidType } from './Tooltip.types.ts';
import { resolveTooltipPlacement } from './Tooltip.helpers.ts';

describe('resolveTooltipPlacement helper', () => {
  test("resolves to 'bottom'", () => {
    const placementIsValid: PositionIsValidType = {
      top: false,
      bottom: true,
      right: true,
      left: false,
    };

    const placementCoordinates: PositionCoordinatesType = {
      top: -140.39206504821777,
      bottom: 69.11190605163574,
      right: 249.48246002197266,
      left: -202.40110778808594,
    };
    expect(resolveTooltipPlacement(placementIsValid, placementCoordinates)).toBe('bottom');
  });

  test("resolves to 'top'", () => {
    const placementIsValid: PositionIsValidType = {
      top: true,
      bottom: true,
      right: true,
      left: true,
    };

    const placementCoordinates: PositionCoordinatesType = {
      bottom: 349.1167335510254,
      left: 114.994140625,
      right: 566.8777084350586,
      top: 139.61276245117188,
    };
    expect(resolveTooltipPlacement(placementIsValid, placementCoordinates)).toBe('top');
  });

  test('resolves to placement with most space', () => {
    const placementIsValid: PositionIsValidType = {
      top: false,
      bottom: false,
      right: false,
      left: false,
    };

    const placementCoordinates: PositionCoordinatesType = {
      bottom: 69.11190605163574,
      left: -117.83685302734375,
      right: 334.04671478271484,
      top: -140.39206504821777,
    };
  });
});
