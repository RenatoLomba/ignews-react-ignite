import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { FC, cloneElement, ReactElement } from 'react';

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

const ActiveLink: FC<ActiveLinkProps> = ({
  activeClassName,
  children,
  ...rest
}) => {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : '';

  return <Link {...rest}>{cloneElement(children, { className })}</Link>;
};

export { ActiveLink };
