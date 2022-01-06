import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { query as q } from 'faunadb';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    GithubProvider({
      id: 'github',
      name: 'GitHub',
      type: 'oauth',
      authorization: 'https://github.com/login/oauth/authorize?scope=read:user',
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.SIGNING_KEY,
  callbacks: {
    async session({ session }) {
      if (!session.activeSubscription) {
        try {
          const userActiveSubscription = await fauna.query(
            q.Get(
              q.Intersection(
                q.Match(
                  q.Index('subscription_by_user_ref'),
                  q.Select(
                    'ref',
                    q.Get(
                      q.Match(
                        q.Index('user_by_email'),
                        q.Casefold(session.user.email),
                      ),
                    ),
                  ),
                ),
                q.Match(q.Index('subscription_by_status'), 'active'),
              ),
            ),
          );

          session.activeSubscription = userActiveSubscription;
        } catch (err) {
          console.log(err);
        }
      }

      return session;
    },
    async signIn({ user }) {
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(user.email)),
              ),
            ),
            q.Create(q.Collection('users'), { data: { email: user.email } }),
            q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email))),
          ),
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});
