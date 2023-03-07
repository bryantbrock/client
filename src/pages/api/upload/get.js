/**
 * @swagger
 * /api/upload:
 *   get:
 *     description: Get list of local files.
 *     responses:
 *       200:
 *         description: Json list of files
 *     tags:
 *      - files
 *   post:
 *     description: upload file
 *     responses:
 *       200:
 *         description: push file
 *     tags:
 *      - files
 */
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { S3 } from "aws-sdk";

export default withApiAuthRequired(async function hanlder(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "GET":
      const query = req.query;
      const { key } = query;
      const s3 = new S3({
        accessKeyId: process.env.S3_UPLOAD_KEY,
        secretAccessKey: process.env.S3_UPLOAD_SECRET,
      });

      try {
        const getParams = {
          Bucket: process.env.S3_UPLOAD_BUCKET, // Bucket
          Key: key,
        };
        let file = await s3.getObject(getParams).promise();
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Disposition", "inline");
        res.setHeader("Content-Disposition", "attachment");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + file.Metadata.og + '"'
        );

        res.send(file.Body);
        res.end();
      } catch (err) {
        res.status(500);
        result = { message: "Unable to get." };
        res.json(result);
      }

      // appendFileSync("data/" + input.name, input.data, 'utf8');

      break;
    case "POST":
    case "DELETE":
    case "PATCH":
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }
});
