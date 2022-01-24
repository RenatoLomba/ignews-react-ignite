import Image from 'next/image';

import { SignInButton } from './SignInButton';

import styles from './styles.module.scss';
import { ActiveLink } from './ActiveLink';

const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
          src="/images/logo.svg"
          alt="ig.news"
          width={108.45}
          height={30.27}
        />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/" passHref>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts" passHref>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
};

export { Header };
