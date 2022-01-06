import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  isCreating: boolean = false,
) {
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId)),
    ),
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscritionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  if (isCreating) {
    await fauna.query(
      q.Create(q.Collection('subscriptions'), { data: subscritionData }),
    );
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('subscription_by_id'), subscription.id)),
        ),
        { data: subscritionData },
      ),
    );
  }
}

export { saveSubscription };
