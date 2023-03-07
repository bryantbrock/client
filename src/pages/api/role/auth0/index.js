/**
 * @swagger
 * /api/role/auth0:
 *   get:
 *     description: get list of roles from auth0
 *     responses:
 *       200:
 *         description: list of roles in auth0
 *     tags:
 *      - roles
 */
import { ManagementClient, AuthenticationClient } from "auth0";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function hanlder(req, res) {
  const method = req.method;
  var auth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
    clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
    audience: process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/",
    scope: "read:roles",
  });
  var response = await auth0.clientCredentialsGrant({
    audience: "https://moldesign.us.auth0.com/api/v2/",
    scope: "read:roles",
  });

  const management = new ManagementClient({
    token: response.access_token,
    domain: process.env.AUTH0_DOMAIN,
  });
  let result;
  switch (method) {
    case "GET":
      result = await management.getRoles();

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
