import type { Meta, StoryObj } from '@storybook/React';

import { AsyncContent, type AsyncContentProps } from '../components/AsyncContent/AsyncContent.tsx';
import { RequestStatus } from '../utils/RequestAPIStatus.ts';
import { errorRequestState } from '../testing/errors.ts';
import type { BaseError } from '../utils/BaseError.ts';
import type { APIStatus } from '../hooks/useApiRequest.ts';

const completeRequestData = {
  userName: 'flower123',
  name: 'Maria',
  location: 'United States',
};

const meta: Meta<AsyncContentProps<typeof completeRequestData>> = {
  component: AsyncContent,
  args: { data: completeRequestData },
};

export default meta;

type Story = StoryObj<AsyncContentProps<typeof completeRequestData>>;

export const InitialStateCustomUI = {
  args: {
    status: RequestStatus.noRequest(),
    data: null,
    initialStateUI: <p>Initial State UI</p>,
  },
} satisfies Story;

export const InitialStateDefaultUI = {
  args: {
    status: RequestStatus.noRequest(),
    data: null,
  },
} satisfies Story;

export const LoadingState = {
  args: {
    status: RequestStatus.pendingRequest(),
    data: null,
  },
} satisfies Story;

export const DefaultErrorState = {
  args: {
    status: errorRequestState,
    data: null,
  },
} satisfies Story;

export const CustomErrorState = {
  args: {
    status: errorRequestState,
    data: null,
    ErrorComponent: ({ error }: { error: BaseError }) => (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          border: '1px dashed #D8D5CB',
          borderRadius: '12px',
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>{error.message}</p>
        <p style={{ margin: '8px 0 0', color: '#6B6963', fontSize: '14px' }}>{error.description}</p>
      </div>
    ),
  },
} satisfies Story;

export const SuccessfulResult = {
  args: {
    children: (_, data) => (
      <p>
        Profile for <strong>{data.name}</strong> loaded successfully.
      </p>
    ),
    status: RequestStatus.completeRequest(),
    data: completeRequestData,
  },
} satisfies Story;

export const CustomResultsComponent = {
  args: {
    status: RequestStatus.completeRequest(),
    data: completeRequestData,
    SuccessComponent: ({ data }: { status: APIStatus; data: typeof completeRequestData }) => (
      <p>
        Welcome back, {data.name} (@{data.userName}) — {data.location}
      </p>
    ),
  },
} satisfies Story;
