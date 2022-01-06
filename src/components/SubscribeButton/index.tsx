import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-client';
import styles from './styles.module.scss';

type SubscribeButtonProps = {
  priceId: string;
};

type SubscribeResponse = {
  sessionId: string;
};

const SubscribeButton: FC<SubscribeButtonProps> = ({ priceId }) => {
  const { push } = useRouter();
  const { data: session } = useSession();

  const handleSubscribe = async () => {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      push('/posts');
      return;
    }

    try {
      const {
        data: { sessionId },
      } = await api.post<SubscribeResponse>('subscribe');

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};

export { SubscribeButton };
