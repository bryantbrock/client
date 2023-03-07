import { getSession } from "@auth0/nextjs-auth0";
import { db } from "services/db";
import record from "../../../../utils/recordAction";

export default async function handler(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "POST":
      try {
        const { id, name, description, tags } = JSON.parse(req.body);

        result = await db.Document.update({
          where: {
            id: id,
          },
          data: {
            name,
            description,
          },
        });

        await db.DocumentToTags.deleteMany({
          where: {
            document_id: id,
          },
        });

        if (tags) {
          tags.forEach(async (tag) => {
            await db.DocumentToTags.create({
              data: {
                document_id: id,
                tag_id: tag.id,
              },
            });
          });
        }

        try {
          // Record Action
          const { user } = await getSession(req, res);

          // localUser --> Data base user
          const localUser = await db.user.findFirst({
            where: { auth0_id: user.sub },
          });
          record({
            module: "library",
            component: "documents",
            action: "edit",
            details: "Document edited",
            user_id: localUser.id,
            object_id: id,
          });
        } catch (error) {}
        res.status(200).json({
          success: true,
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
      break;
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }
}
