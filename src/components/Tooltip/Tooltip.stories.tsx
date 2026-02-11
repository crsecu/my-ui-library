import type { Meta, StoryObj } from '@storybook/React';

import { fn } from 'storybook/test';

import { Tooltip } from './Tooltip';

import { Button } from '../Button/Button';

export const ActionsData = {
  onMouseEnter: fn(),
  onmouseleave: fn(),
  onFocus: fn(),
  onBluer: fn(),
};

const meta = {
  component: Tooltip,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    children: <Button variant="tertiary">Learn more</Button>,
    forceOpen: true,
    ...ActionsData,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
    Physical placement of the Tooltip relative to the triggering element
    Options: 'top' | 'bottom' | 'left' | 'right';
    Default: 'top'
*/
export const DefaultTooltip: Story = {
  name: 'Top Center (default)',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  },
};
export const PositionBottom: Story = {
  name: 'Bottom Center',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'bottom',
  },
};
export const PositionRight: Story = {
  name: 'Right Center',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'right',
  },
};
export const PositionLeft: Story = {
  name: 'Left Center',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'left',
  },
};

/*
    Alignment of the Tooltip relative to the selected position
    Options: 'start' | 'center' | 'end'
    Default: 'center'
*/

//Top Positioned Tooltip
export const TopStart: Story = {
  name: 'Top Start',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    align: 'start',
  },
};

export const TopEnd: Story = {
  name: 'Top End',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    align: 'end',
  },
};

//Bottom Positioned Tooltip
export const BottomStart: Story = {
  name: 'Bottom Start',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'bottom',
    align: 'start',
  },
};

export const BottomEnd: Story = {
  name: 'Bottom End',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'bottom',
    align: 'end',
  },
};

//Right Positioned Tooltip
export const RightStart: Story = {
  name: 'Right Start',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'right',
    align: 'start',
  },
};

export const RightEnd: Story = {
  name: 'Right End',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'right',
    align: 'end',
  },
};

//Left Positioned Tooltip
export const LeftStart: Story = {
  name: 'Left Start',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'left',
    align: 'start',
  },
};

export const LeftEnd: Story = {
  name: 'Left End',
  args: {
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    position: 'left',
    align: 'end',
  },
};
