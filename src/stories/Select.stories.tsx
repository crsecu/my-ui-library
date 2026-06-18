import type { Meta, StoryObj } from '@storybook/React';
import { useState } from 'storybook/preview-api';
import Select from '../components/Select/Select.tsx';
import { selectOptions } from '../components/Select/selectTestData.ts';

const meta = {
  title: 'Inputs/Select',
  component: Select,
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [value, setValue] = useState(args.value ?? '');

    return <Select {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    id: 'selectDefault',
    value: '',
    name: 'defaultStory',
    placeholder: 'Placeholder text...',
    options: selectOptions,
    onChange: () => {},
  },
};

export const WithSearchField: Story = {
  args: {
    label: 'Label',
    id: 'selectWithSearchField',
    value: '',
    name: 'selectWithSearchFieldStory',
    placeholder: 'Placeholder text...',
    options: selectOptions,
    onChange: () => {},
    searchable: true,
  },
};

export const WithFreeText: Story = {
  args: {
    ...WithSearchField.args,
    id: 'selectWithFreeText',
    name: 'selectWithFreeTextStory',
    withFreeText: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    id: 'selectDisabled',
    name: 'selectDisabledStory',
    disabled: true,
  },
};
