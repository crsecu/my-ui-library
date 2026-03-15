/* eslint-disable storybook/no-redundant-story-name */
import type { Meta, StoryObj } from '@storybook/React';
import { fn } from 'storybook/test';
import { MockTooltipAnchor } from './utils/MockTooltipAnchor/MockTooltipAnchor.tsx';

export const ActionsData = {
  onMouseEnter: fn(),
  onmouseleave: fn(),
  onFocus: fn(),
  onBluer: fn(),
};

const meta = {
  title: 'Tooltip',
  component: MockTooltipAnchor,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    children: 'Hover here',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    ...ActionsData,
  },
} satisfies Meta<typeof MockTooltipAnchor>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
    Position of the Tooltip relative to the anchor
    Options: 'top' | 'bottom' | 'left' | 'right';
    Default: 'top'
*/
export const DefaultTooltip: Story = {
  name: 'Top Center (default)',
  args: {},
};
export const PositionBottom: Story = {
  name: 'Bottom Center',
  args: {
    tooltipPosition: 'bottom',
  },
};
export const PositionRight: Story = {
  name: 'Right Center',
  args: {
    tooltipPosition: 'right',
  },
};
export const PositionLeft: Story = {
  name: 'Left Center',
  args: {
    tooltipPosition: 'left',
  },
};

/*
    Alignment of the Tooltip relative to the anchor
    Options: 'start' | 'center' | 'end'
    Default: 'center'
*/

//Top Positioned Tooltip
export const TopStart: Story = {
  name: 'Top Start',
  args: {
    tooltipAlignment: 'start',
    forceTooltipOpen: true,
  },
};

export const TopEnd: Story = {
  name: 'Top End',
  args: {
    tooltipAlignment: 'end',
  },
};

//Bottom Positioned Tooltip
export const BottomStart: Story = {
  name: 'Bottom Start',
  args: {
    tooltipPosition: 'bottom',
    tooltipAlignment: 'start',
  },
};

export const BottomEnd: Story = {
  name: 'Bottom End',
  args: {
    tooltipPosition: 'bottom',
    tooltipAlignment: 'end',
  },
};

//Right Positioned Tooltip
export const RightStart: Story = {
  name: 'Right Start',
  args: {
    tooltipPosition: 'right',
    tooltipAlignment: 'start',
  },
};

export const RightEnd: Story = {
  name: 'Right End',
  args: {
    tooltipPosition: 'right',
    tooltipAlignment: 'end',
  },
};

//Left Positioned Tooltip
export const LeftStart: Story = {
  name: 'Left Start',
  args: {
    tooltipPosition: 'left',
    tooltipAlignment: 'start',
  },
};

export const LeftEnd: Story = {
  name: 'Left End',
  args: {
    tooltipPosition: 'left',
    tooltipAlignment: 'end',
  },
};
