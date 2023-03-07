/**
 * @swagger
 * /api/role:
 *   get:
 *     description: Get list of local roles.
 *     responses:
 *       200:
 *         description: Json list of roles
 *     tags:
 *      - roles
 */
import { db } from "services/db";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function hanlder(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "GET":
      result = await db.Roles.findMany();

      break;
    case "POST":
    case "DELETE":
    case "PATCH":
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }

  res.json(result);
});
