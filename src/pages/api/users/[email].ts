import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { RoleName } from "types/schema";
import { User } from "@prisma/client";
import { db } from "services/db";
import has from "lodash/has";

/**
 * POST /users/:email
 * Get a user by email and pass a `Prisma.UserFindManyArgs` as the body
 */
export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
      const { email } = req.query;
      const query = JSON.parse(req.body ?? "{}");

      try {
        let user = await db.user.findUnique({
          where: { email: email as string },
          ...(query && query),
        });

        if (user) {
          const isAdmin = user.roleName === RoleName.Admin;

          if (isAdmin && has(query, "include.allowedTags")) {
            const allTags = await db.tag.findMany(query.include.allowedTags);

            user = { ...user, allowedTags: allTags } as User;
          }

          if (isAdmin && has(query, "include.quickFilters")) {
            const allQuickFilters = await db.quickFilter.findMany(
              query.include.quickFilters
            );

            user = { ...user, quickFilters: allQuickFilters } as User;
          }

          res.status(200).json(user);
        } else {
          res.status(422);
        }
      } catch {
        res
          .status(422)
          .json({ error: `Failed to fetch a user by email ${email}` });
      }
    }
  }
);
