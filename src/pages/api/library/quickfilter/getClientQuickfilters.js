import { db } from "services/db";
import { Prisma as PrismaDef } from "@prisma/client";

export default async function handler(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "GET":
      break;
    case "POST":
      try {
        const { client_id } = JSON.parse(req.body);

        let tags = await db.ClientToTag.findMany({
          where: {
            client_id: client_id,
            permission: 1,
          },
        });

        let tagIDs = [];

        tags.forEach((res) => {
          tagIDs.push(res.tag_id);
        });

        if (tagIDs.length > 0) {
          let quickFilters = await db.$queryRaw(
            PrismaDef.sql`

                    SELECT DISTINCT qf.*

                    FROM [QuickFilterToTags] as main, [QuickFilter] as qf

                    WHERE

                    main.tag_id in (${PrismaDef.join(tagIDs)})

                    AND main.quickfilter_id=qf.id

                    AND NOT EXISTS (

                        SELECT * FROM [QuickFilterToTags] as xcl

                        WHERE xcl.tag_id NOT IN (${PrismaDef.join(tagIDs)})

                        AND main.quickfilter_id=xcl.quickfilter_id)

                        ORDER BY qf.sort_order ASC

                        `
          );

          result = quickFilters;
        }

        if (tagIDs.length <= 0) {
          result = [];
        }
        break;
      } catch (error) {}
    case "DELETE":
      break;
    case "PATCH":
      break;
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }

  res.json(result);
}
