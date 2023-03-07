import { useUser as useOAuthUser } from "@auth0/nextjs-auth0/client";
import { Prisma } from "@prisma/client";
import { useQuery } from "react-query";

const include = Prisma.validator<Prisma.UserInclude>()({
  defaultTags: true,
  allowedTags: true,
  disabledTags: true,
  quickFilters: { include: { tags: true } },
});

export type User = Prisma.UserGetPayload<{
  include: typeof include;
}>;

export function useUser() {
  const OAuthUser = useOAuthUser();
  const key = ["/api/users", OAuthUser.user?.email, include];

  const { data: user, ...params } = useQuery<User>(
    key,
    ({ queryKey: [_, email] }) =>
      fetch(`/api/users/${email}`, {
        method: "POST",
        body: JSON.stringify({ include }),
      }).then((res) => res.json())
  );

  return { key, user, ...params };
}
