import { db } from "services/db";

export default async function handler(req, res) {
  const method = req.method;

  let result;

  switch (method) {
    case "GET":
      break;
    case "POST":
      const { id } = JSON.parse(req.body);

      result = await db.QuickFilterToTags.findMany({
        where: {
          quickfilter_id: id,
        },
        include: { tag: true },
      });
      break;
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
