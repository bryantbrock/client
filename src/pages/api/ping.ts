import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/ping:
 *   get:
 *     description: Check to see if API is alive. Should return status 200 and "pong" in json
 *     responses:
 *       200:
 *         description: pong
 *     tags:
 *      - healthcheck
 */
const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    result: "pong",
  });
};
export default handler;
