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
// import { appendFileSync } from 'node:fs';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired value here
    },
  },
};

export default withApiAuthRequired(async function hanlder(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "GET":
      res.status(200).end("ok");
      break;
    case "POST":
      const input = JSON.parse(req.body);
      const s3 = new S3({
        accessKeyId: process.env.S3_UPLOAD_KEY,
        secretAccessKey: process.env.S3_UPLOAD_SECRET,
      });

      let name = input.name;
      let path = btoa(name).replace(/[^0-9a-z]/gi, "");
      try {
        let file = input.data.split(",");
        let body = Buffer.from(file[1], "base64");

        let type = file[0].split(";")[0].split(":")[1];
        const uploadParams = {
          Bucket: process.env.S3_UPLOAD_BUCKET, // Bucket into which you want to upload file
          Key: path, // Name by which you want to save it
          ContentEncoding: "base64",
          ContentType: type,
          Body: body, // Local file
          Metadata: {
            og: name,
          },
        };
        let data = await s3.upload(uploadParams).promise();
        result = { path: path };
      } catch (err) {
        res.status(500);
        result = { message: "Unable to upload." };
      }

      // appendFileSync("data/" + input.name, input.data, 'utf8');

      break;
    case "DELETE":
    case "PATCH":
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }

  res.json(result);
});
