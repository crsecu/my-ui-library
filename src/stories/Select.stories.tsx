import type { Meta, StoryObj } from '@storybook/React';
import { Select } from '../components/Select/Select.tsx';
import { selectOptions } from '../components/Select/selectTestData.ts';
import { ControlledFieldWrapper } from '../testing/wrappers/ControlledFieldWrapper.tsx';
import { FormikFieldWrapper } from '../testing/wrappers/FormikFieldWrapper.tsx';

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

  render: (args) => (
    <ControlledFieldWrapper initialValue={args.value ?? ''}>
      {({ value, onChange }) => (
        <>
          <p style={{ marginBottom: '30px', fontStyle: 'italic', color: 'red', fontSize: '14px' }}>
            The option stored in Formik is: {value || 'None'}
          </p>
          <Select {...args} value={value} onChange={onChange} />
        </>
      )}
    </ControlledFieldWrapper>
  ),
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

export const WithFormik: Story = {
  args: {
    label: 'Label',
    id: 'selectFormik',
    name: 'favorite',
    placeholder: 'Placeholder text...',
    options: selectOptions,
  },
  render: (args) => (
    <FormikFieldWrapper initialValues={{ favorite: '' }}>
      {({ values }) => (
        <>
          <p style={{ marginBottom: '30px', fontStyle: 'italic', color: 'red', fontSize: '14px' }}>
            The selected option is: {values.favorite || 'None'}
          </p>

          <Select {...args} />
        </>
      )}
    </FormikFieldWrapper>
  ),
};
