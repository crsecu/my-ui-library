import { Input } from '../components/Input/Input.tsx';
import type { Meta, StoryObj } from '@storybook/React';
import { useState } from 'storybook/preview-api';

const meta = {
  title: 'Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  decorators: [
    (Story) => (
      <div style={{ width: '260px' }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value ?? '');

    // @ts-expect-error: quieting type mismatch
    return <Input {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelText: 'Label',
    id: 'inputDefault',
    value: '',
    name: 'defaultStory',
    onChange: () => {},
  },
};

export const WithPlaceholder: Story = {
  args: {
    ...Default.args,
    id: 'inputPlaceholder',
    name: 'inputPlaceholderStory',
    placeholder: 'Type something...',
  },
};

export const WithClearValueButton: Story = {
  args: {
    ...Default.args,
    id: 'inputClearValueStory',
    name: 'inputClearValue',
    value: 'Some value',
    clearInput: true,
  },
};

export const Password: Story = {
  args: {
    ...WithClearValueButton.args,
    type: 'password',
    id: 'inputPasswordStory',
    name: 'inputPassword',
    showPassword: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    id: 'inputErrorStory',
    name: 'inputError',
    error: 'Something went wrong...',
    clearInput: true,
    tooltipAlignment: 'end',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    id: 'inputDisabled',
    name: 'inputDisabledStory',
    disabled: true,
  },
};

export const Focused: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvas, userEvent }) => {
    const inputEl = canvas.getByLabelText('Label');
    await userEvent.click(inputEl);
  },
};

export const FocusedWithError: Story = {
  args: {
    ...Default.args,
    error: 'Something went wrong',
    id: 'inputErrorFocusedStory',
    name: 'inputErrorFocused',
    tooltipPosition: 'bottom',
    tooltipAlignment: 'end',
  },
  play: async ({ canvas, userEvent }) => {
    const inputEl = canvas.getByLabelText('Label');
    await userEvent.type(inputEl, 'Test');
  },
};
