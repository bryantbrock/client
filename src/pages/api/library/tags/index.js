import { db } from "services/db";

export default async function handler(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "GET":
      result = await prisma.tags.findMany({ include: { category: true } });
      break;
    case "POST":
    case "DELETE":
    case "PATCH":
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }

  res.json(result);
}
