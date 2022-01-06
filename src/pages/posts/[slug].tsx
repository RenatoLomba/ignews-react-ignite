import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { RichText } from 'prismic-dom';

import styles from '../../styles/post.module.scss';
import { getPrismicClient } from '../../services/prismic';

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

type PostProps = {
  post: Post;
};

const Post: NextPage<PostProps> = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
};

type PostResponse = {
  title: string;
  content: { type: string; text: string }[];
};

const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });

  const slug = String(params.slug);

  if (!session?.activeSubscription) {
    return {
      redirect: { destination: `/posts/preview/${slug}`, permanent: false },
    };
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID<PostResponse>('post', slug, {});

  const post: Post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  return {
    props: { post },
  };
};

export { getServerSideProps };
export default Post;
