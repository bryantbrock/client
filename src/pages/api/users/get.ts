import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Prisma, User } from "@prisma/client";
import { db } from "services/db";

export default withApiAuthRequired(async (req, res) => {
  if (req.method === "POST") {
    try {
      let users: User[];

      if (req.body) {
        users = await db.user.findMany(JSON.parse(req.body));
      } else {
        users = await db.user.findMany();
      }

      res.json(users);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500);
      } else {
        res.status(500);
      }
    }
  }
});
