import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
  return {
    useRouter: () => ({ asPath: '/' }),
  };
});

describe('ActiveLink component', () => {
  it('should be able to renders correctly', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should have active class if the asPath is equal to the href prop', () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(screen.getByText('Home')).toHaveClass('active');
  });

  test('should have not active class if the asPath is diferent to the href prop', () => {
    render(
      <ActiveLink href="/posts" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );

    expect(screen.getByText('Home')).not.toHaveClass('active');
  });
});
