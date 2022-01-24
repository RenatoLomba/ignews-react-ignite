import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';
import { SignInButton } from '.';

jest.mock('next-auth/react');

const useSessionMocked = mocked(useSession);

describe('SignInButton component', () => {
  it('should be able to renders correctly when user is not authenticated', () => {
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<SignInButton />);

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  });

  it('should be able to renders correctly when user is authenticated', () => {
    useSessionMocked.mockReturnValueOnce({
      data: { user: { name: 'John Doe' }, expires: 'Yes' },
      status: 'authenticated',
    });

    render(<SignInButton />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
