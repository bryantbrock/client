import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Prisma, User } from "@prisma/client";
import { db } from "services/db";

export default withApiAuthRequired(async (req, res) => {
  if (req.method === "GET") {
    try {
      const tagGroup = await db.tagGroup.findMany({
        include: { tags: true },
      });

      res.json(tagGroup);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500);
      } else {
        res.status(500);
      }
    }
  }

  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const updateTagsQueries = body.updateTagsQueries as Prisma.TagUpdateArgs[];
    const updateTagGroupQuery =
      body.updateTagGroupQuery as Prisma.TagGroupUpsertArgs;

    try {
      const [updatedTags, updatedTagGroup] = await Promise.all([
        Promise.all(updateTagsQueries.map((query) => db.tag.update(query))),
        db.tagGroup.upsert(updateTagGroupQuery),
      ]);

      const updatedOperatingAs = await db.user.findFirst({
        where: { id: body.operatingAsId },
        include: {
          allowedTags: true,
          disabledTags: true,
          defaultTags: true,
          quickFilters: { include: { tags: true } },
        },
      });

      res.json({
        updatedTags,
        updatedTagGroup,
        updatedOperatingAs,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500);
      } else {
        res.status(500);
      }
    }
  }
});
