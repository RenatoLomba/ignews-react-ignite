import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { SubscribeButton } from '.';

jest.mock('next-auth/react');
jest.mock('next/router');

const useSessionMocked = mocked(useSession);
const useRouterMocked = mocked(useRouter);

const pushMock = jest.fn();

useRouterMocked.mockReturnValue({ push: pushMock } as any);

describe('SubscribeButton component', () => {
  it('should be able to renders correctly', () => {
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<SubscribeButton />);

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('should be able to sign in user when not authenticated', () => {
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    const signInMocked = mocked(signIn);

    render(<SubscribeButton />);

    const subscribeNowElement = screen.getByText('Subscribe now');

    fireEvent.click(subscribeNowElement);

    expect(signInMocked).toHaveBeenCalledWith('github');
  });

  it('should redirect to /posts when user already have an active subscription', () => {
    useSessionMocked.mockReturnValueOnce({
      data: {
        expires: 'fake-expires',
        activeSubscription: 'fake-subscription',
      },
      status: 'authenticated',
    });

    render(<SubscribeButton />);

    const subscribeNowElement = screen.getByText('Subscribe now');

    fireEvent.click(subscribeNowElement);

    expect(pushMock).toBeCalledWith('/posts');
  });
});
