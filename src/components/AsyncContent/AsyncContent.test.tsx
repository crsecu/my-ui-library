import { AsyncContent } from './AsyncContent.tsx';
import { render, screen } from '@testing-library/react';
import { RequestStatus } from '../../utils/RequestAPIStatus.ts';
import { errorRequestState, serverError } from '../../testing/errors.ts';
import type { BaseError } from '../../utils/BaseError.ts';
import type { APIStatus } from '../../hooks/useApiRequest.ts';

describe('AsyncContent component - initial state', () => {
  test('should render content passed via initialStateUI prop on initial state', () => {
    render(
      <AsyncContent
        status={RequestStatus.noRequest()}
        data={null}
        initialStateUI={<p>This is the initial UI</p>}
      />,
    );

    expect(screen.getByText('This is the initial UI')).toBeInTheDocument();
  });

  test('should render a loader when initialStateUI prop is omitted', () => {
    render(<AsyncContent status={RequestStatus.noRequest()} data={null} />);

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });

  test('should render nothing on initial state when initialStateUI is explicitly null', () => {
    const { container } = render(
      <AsyncContent status={RequestStatus.noRequest()} data={null} initialStateUI={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe('AsyncContent component - pending state', () => {
  test('should render a loader while the request is pending', () => {
    render(<AsyncContent status={RequestStatus.pendingRequest()} data={null} />);
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });
});

describe('AsyncContent component - success state', () => {
  const SuccessComp = ({
    data: { userName, name },
    status,
  }: {
    data: { userName: string; name: string };
    status: APIStatus;
  }) => {
    return (
      <div>
        <p>CUSTOM SUCCESS COMPONENT</p> <p>{name}</p>
        <p>{userName}</p>
        {status.isCompleteRequest() && <p>Status: complete</p>}
      </div>
    );
  };

  const successState = { userName: 'tedTeam', name: 'Ted' };

  test('should render children when the request completes successfully', () => {
    render(
      <AsyncContent status={RequestStatus.completeRequest()} data={successState}>
        {() => <p>Children Rendered</p>}
      </AsyncContent>,
    );

    expect(screen.getByText('Children Rendered')).toBeInTheDocument();
  });

  test('should render custom results component instead of children', () => {
    render(
      <AsyncContent
        status={RequestStatus.completeRequest()}
        data={successState}
        SuccessComponent={SuccessComp}
      >
        {() => <p>Children Rendered</p>}
      </AsyncContent>,
    );

    expect(screen.queryByText('Children Rendered')).not.toBeInTheDocument();
    expect(screen.getByText('CUSTOM SUCCESS COMPONENT')).toBeInTheDocument();
  });

  test('should pass status and data to SuccessComponent when request completes successfully', () => {
    render(
      <AsyncContent
        status={RequestStatus.completeRequest()}
        data={successState}
        SuccessComponent={SuccessComp}
      />,
    );

    expect(screen.getByText('Ted')).toBeInTheDocument();
    expect(screen.getByText('tedTeam')).toBeInTheDocument();
    expect(screen.getByText('Status: complete')).toBeInTheDocument();
  });

  test('should pass status and data to children when request completes successfully', () => {
    render(
      <AsyncContent status={RequestStatus.completeRequest()} data={successState}>
        {(status, data) => (
          <div>
            <p>Children Rendered</p>
            {status.isCompleteRequest() && <p>Success: {data.name}</p>}
          </div>
        )}
      </AsyncContent>,
    );

    expect(screen.getByText('Success: Ted')).toBeInTheDocument();
  });

  test('should render nothing when the request completes with null data', () => {
    const { container } = render(
      <AsyncContent status={RequestStatus.completeRequest()} data={null} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

describe('AsyncContent component - error state', () => {
  const ErrorComp = ({ error }: { error: BaseError }) => {
    return (
      <div>
        <p>CUSTOM ERROR COMPONENT</p>
        <p>{error.message}</p>
        <button>Try again</button>
      </div>
    );
  };

  test('should render a default error component when request fails', () => {
    render(<AsyncContent status={errorRequestState} data={null} />);

    expect(screen.getByText(serverError.message)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Error Log' })).toBeInTheDocument();
  });

  test('should render custom error component instead of default error component', () => {
    render(<AsyncContent status={errorRequestState} data={null} ErrorComponent={ErrorComp} />);
    expect(screen.queryByRole('button', { name: 'View Error Log' })).not.toBeInTheDocument();
    expect(screen.getByText('CUSTOM ERROR COMPONENT')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  test('should pass request error to ErrorComponent', () => {
    render(<AsyncContent status={errorRequestState} data={null} ErrorComponent={ErrorComp} />);

    expect(screen.getByText('CUSTOM ERROR COMPONENT')).toBeInTheDocument();
    expect(screen.getByText(serverError.message)).toBeInTheDocument();
  });
});
