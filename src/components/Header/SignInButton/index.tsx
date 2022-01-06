import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useSession, signIn, signOut } from 'next-auth/react';

import styles from './styles.module.scss';

const SignInButton = () => {
  const { data: session } = useSession();

  return session ? (
    <button
      onClick={() => signOut()}
      type="button"
      className={styles.signInButton}
    >
      <FaGithub color="var(--green-500)" />
      {session.user?.name}
      <FiX color="var(--gray-400)" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      onClick={() => signIn('github')}
      type="button"
      className={styles.signInButton}
    >
      <FaGithub color="var(--yellow-500)" /> Sign in with Github
    </button>
  );
};

export { SignInButton };
