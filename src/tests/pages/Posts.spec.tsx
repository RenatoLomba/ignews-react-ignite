import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';

import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

const posts = [
  {
    slug: 'post-1',
    title: 'Post 1',
    excerpt: 'Post excerpt',
    updatedAt: '01 de abril de 2021',
  },
];

jest.mock('../../services/prismic');

describe('Posts page', () => {
  it('should be able to renders correctly', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText('Post 1')).toBeInTheDocument();
  });

  it('should load initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'post-1',
            data: {
              title: [{ type: 'heading', text: 'Post 1' }],
              content: [{ type: 'paragraph', text: 'Post excerpt' }],
            },
            last_publication_date: '04-01-2021',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts,
        },
      }),
    );
  });
});
