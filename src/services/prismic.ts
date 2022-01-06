import Prismic from '@prismicio/client';

function getPrismicClient(req?: unknown) {
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

  const prismic = Prismic.client(process.env.PRISMIC_APP_ENTRYPOINT, {
    req,
    accessToken,
  });

  return prismic;
}

export { getPrismicClient };
