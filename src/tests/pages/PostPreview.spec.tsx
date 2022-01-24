import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = {
  slug: 'post-1',
  title: 'Post 1',
  content: '<p>Post content</p>',
  updatedAt: '01 de abril de 2021',
};

const slug = post.slug;

jest.mock('../../services/prismic');
jest.mock('next-auth/react');
jest.mock('next/router');

const useSessionMocked = mocked(useSession);
const useRouterMocked = mocked(useRouter);

const pushMock = jest.fn();

useRouterMocked.mockReturnValue({ push: pushMock } as any);

describe('PostPreview page', () => {
  it('should be able to renders correctly', () => {
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    });

    render(<Post post={post} />);

    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('should redirect user if have active subscription', async () => {
    useSessionMocked.mockReturnValueOnce({
      data: { activeSubscription: true },
      status: 'authenticated',
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toBeCalledWith(`/posts/${slug}`);
  });

  it('should load initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'Post 1' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);

    const response = await getStaticProps({ params: { slug } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post,
        },
      }),
    );
  });
});
