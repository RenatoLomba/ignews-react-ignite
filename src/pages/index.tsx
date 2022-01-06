import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from '../styles/home.module.scss';

type Product = {
  priceId: string;
  amount: number;
  amountFormatted: string;
  recurringInterval: string;
};

type HomeProps = {
  product: Product;
};

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>
            👏 <strong>Hey, welcome</strong>
          </span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get acess to all the publications <br />
            <span>
              for {product.amountFormatted} {product.recurringInterval}
            </span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image
          src="/images/avatar.svg"
          alt="Girl Coding"
          width={334}
          height={520}
        />
      </main>
    </>
  );
};

const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.PRICE_API_ID);

  const amount = price.unit_amount / 100;

  const product: Product = {
    priceId: price.id,
    amount,
    amountFormatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount),
    recurringInterval: price.recurring.interval,
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

export { getStaticProps };
export default Home;
