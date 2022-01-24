import { render, screen } from '@testing-library/react';
import { Header } from '.';

jest.mock('next/router', () => {
  return {
    useRouter: () => ({ asPath: '/' }),
  };
});

jest.mock('next-auth/react', () => {
  return {
    useSession: () => ({ data: null }),
  };
});

describe('Header component', () => {
  it('should be able to renders correctly', () => {
    render(<Header />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });
});
