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

  let result = [],
    meta;

  switch (method) {
    case "GET":
      const s3 = new S3({
        accessKeyId: process.env.S3_UPLOAD_KEY,
        secretAccessKey: process.env.S3_UPLOAD_SECRET,
      });

      try {
        const listParams = {
          Bucket: process.env.S3_UPLOAD_BUCKET, // Bucket
          Delimiter: "/",
        };
        let data = await s3.listObjectsV2(listParams).promise();
        for (const object of data.Contents) {
          const metaParams = {
            Bucket: process.env.S3_UPLOAD_BUCKET, // Bucket
            Key: object.Key,
          };
          meta = await s3.headObject(metaParams).promise();

          result.push({
            path:
              process.env.AUTH0_BASE_URL +
              "/api/upload/get?key=" +
              object.Key +
              "",
            key: object.Key,
            name: meta.Metadata.og,
          });
        }
        res.json(result);
      } catch (err) {
        res.status(500);
        result = { message: "Unable to list." };
      }

      break;
    case "POST":
    case "DELETE":
    case "PATCH":
    default:
      res.status(405).end(`Method ${method} not allowed`);
      res.json(result);
      break;
  }
});
