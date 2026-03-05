import type { Meta, StoryObj } from '@storybook/React';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { StoryGallery } from './StoryGallery';

export const ActionsData = {
  onClick: fn(),
  onFocus: fn(),
  onBlur: fn(),
};

const meta = {
  title: 'Buttons/Variants',
  component: StoryGallery,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  args: {
    children: 'Button',
    ...ActionsData,
  },
} satisfies Meta<typeof StoryGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    title: 'Solid Buttons: primary, neutral, success, danger, warning',
    children: (
      <>
        <Button variant="solid" intent="primary">
          Button
        </Button>
        <Button variant="solid" intent="neutral">
          Button
        </Button>
        <Button variant="solid" intent="success">
          Button
        </Button>
        <Button variant="solid" intent="danger">
          Button
        </Button>
        <Button variant="solid" intent="warning">
          Button
        </Button>
      </>
    ),
  },
};

export const Outlined: Story = {
  args: {
    title: 'Outlined Buttons: primary, neutral, success, danger, warning',
    children: (
      <>
        <Button variant="outlined" intent="primary">
          Button
        </Button>
        <Button variant="outlined" intent="neutral">
          Button
        </Button>
        <Button variant="outlined" intent="success">
          Button
        </Button>
        <Button variant="outlined" intent="danger">
          Button
        </Button>
        <Button variant="outlined" intent="warning">
          Button
        </Button>
      </>
    ),
  },
};
export const Soft: Story = {
  args: {
    title: 'Soft Buttons: primary, neutral, success, danger, warning',
    children: (
      <>
        <Button variant="soft" intent="primary">
          Button
        </Button>
        <Button variant="soft" intent="neutral">
          Button
        </Button>
        <Button variant="soft" intent="success">
          Button
        </Button>
        <Button variant="soft" intent="danger">
          Button
        </Button>
        <Button variant="soft" intent="warning">
          Button
        </Button>
      </>
    ),
  },
};
export const Surface: Story = {
  args: {
    title: 'Surface Buttons: primary, neutral, success, danger, warning',
    children: (
      <>
        <Button variant="surface" intent="primary">
          Button
        </Button>
        <Button variant="surface" intent="neutral">
          Button
        </Button>
        <Button variant="surface" intent="success">
          Button
        </Button>
        <Button variant="surface" intent="danger">
          Button
        </Button>
        <Button variant="surface" intent="warning">
          Button
        </Button>
      </>
    ),
  },
};
export const Text: Story = {
  args: {
    title: 'Text Buttons: primary, neutral, success, danger, warning',
    children: (
      <>
        <Button variant="text" intent="primary">
          Button
        </Button>
        <Button variant="text" intent="neutral">
          Button
        </Button>
        <Button variant="text" intent="success">
          Button
        </Button>
        <Button variant="text" intent="danger">
          Button
        </Button>
        <Button variant="text" intent="warning">
          Button
        </Button>
      </>
    ),
  },
};
