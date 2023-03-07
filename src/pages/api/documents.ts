import { db } from "services/db";
import { Prisma } from "@prisma/client";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      try {
        const { query } = req;
        const { clientId, q: searchTerm, tags: rawTags = "" } = query;
        const tags = (rawTags as string).split(",").filter(Boolean);

        const documents = await db.document.findMany({
          where: {
            ...(searchTerm && { name: { contains: searchTerm as string } }),
            ...(tags.length && {
              AND: tags.map((tag) => ({
                tags: { some: { name: { equals: tag } } },
              })),
            }),
          },
          include: {
            versions: {
              where: {
                OR: [
                  {
                    ...(clientId && {
                      uploadedById: parseInt(clientId as string),
                    }),
                    type: "final",
                  },
                  { type: "template" },
                ],
              },
            },
            tags: true,
          },
        });

        res.json(documents);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Error unknown" });
        }
      }
    }

    if (req.method === "POST") {
    }
  }
);
