import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/react';

import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'post-1',
  title: 'Post 1',
  content: '<p>Post content</p>',
  updatedAt: '01 de abril de 2021',
};

const slug = post.slug;

jest.mock('next-auth/react');
jest.mock('../../services/prismic');

describe('Post page', () => {
  it('should be able to renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });

  it('should redirect user if no subscription found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({ params: { slug } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: { destination: `/posts/preview/${slug}`, permanent: false },
      }),
    );
  });

  it('should load initial data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({ activeSubscription: true } as any);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'Post 1' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);

    const response = await getServerSideProps({ params: { slug } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post,
        },
      }),
    );
  });
});
