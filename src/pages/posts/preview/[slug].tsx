import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';

import styles from '../../../styles/post.module.scss';
import { getPrismicClient } from '../../../services/prismic';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

type PostPreviewProps = {
  post: Post;
};

const PostPreview: NextPage<PostPreviewProps> = ({ post }) => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session, router, post.slug]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/" passHref>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

type PostResponse = {
  title: string;
  content: { type: string; text: string }[];
};

const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params.slug);

  const prismic = getPrismicClient();

  const response = await prismic.getByUID<PostResponse>('post', slug, {});

  const post: Post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
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
    revalidate: 60 * 60, // 1 hour
  };
};

export { getStaticProps, getStaticPaths };
export default PostPreview;
