/* eslint-disable storybook/no-redundant-story-name */
import type { Meta, StoryObj } from '@storybook/React';

import { fn } from 'storybook/test';

import { Button } from './Button';

export const ActionsData = {
  onMouseEnter: fn(),
  onmouseleave: fn(),
  onFocus: fn(),
  onBluer: fn(),
};

const meta = {
  title: 'Buttons/Button (with tooltip)',
  component: Button,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    children: 'Anchor',
    ...ActionsData,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
    Position of the Tooltip relative to the anchor
    Options: 'top' | 'bottom' | 'left' | 'right';
    Default: 'top'
*/
export const DefaultTooltip: Story = {
  name: 'Top Center (default)',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
};
export const PositionBottom: Story = {
  name: 'Bottom Center',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipPosition: 'bottom',
  },
};
export const PositionRight: Story = {
  name: 'Right Center',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipPosition: 'right',
  },
};
export const PositionLeft: Story = {
  name: 'Left Center',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
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
  // eslint-disable-next-line storybook/no-redundant-story-name
  name: 'Top Start',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipAlignment: 'start',
  },
};

export const TopEnd: Story = {
  name: 'Top End',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipAlignment: 'end',
  },
};

//Bottom Positioned Tooltip
export const BottomStart: Story = {
  name: 'Bottom Start',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipPosition: 'bottom',
    tooltipAlignment: 'start',
  },
};

export const BottomEnd: Story = {
  name: 'Bottom End',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipPosition: 'bottom',
    tooltipAlignment: 'end',
  },
};

//Right Positioned Tooltip
export const RightStart: Story = {
  name: 'Right Start',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipPosition: 'right',
    tooltipAlignment: 'start',
  },
};

export const RightEnd: Story = {
  name: 'Right End',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipPosition: 'right',
    tooltipAlignment: 'end',
  },
};

//Left Positioned Tooltip
export const LeftStart: Story = {
  name: 'Left Start',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipPosition: 'left',
    tooltipAlignment: 'start',
  },
};

export const LeftEnd: Story = {
  name: 'Left End',
  args: {
    children: 'Anchor',
    tooltipText:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tooltipPosition: 'left',
    tooltipAlignment: 'end',
  },
};
