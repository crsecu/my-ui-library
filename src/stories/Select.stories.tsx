import type { Meta, StoryObj } from '@storybook/React';
import { useState } from 'storybook/preview-api';
import Select from '../components/Select/Select.tsx';
import type { Option } from '../components/Select/SelectOption.tsx';

const options: Option[] = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'bird', label: 'Bird' },
  { value: 'fish', label: 'Fish' },
  { value: 'cow', label: 'Cow' },
  { value: 'horse', label: 'Horse' },
  { value: 'grumpy cat', label: 'Grumpy cat' },
  { value: 'donkey', label: 'Donkey' },
  { value: 'penguin', label: 'Penguin' },
  { value: 'giraffe', label: 'Giraffe' },
  { value: 'cute cat', label: 'Cute cat' },
];

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
    options: options,
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
    options: options,
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
