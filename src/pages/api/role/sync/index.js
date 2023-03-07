/**
 * @swagger
 * /api/role/sync:
 *   get:
 *     description: Syncronize users from auth0 to local db.
 *     responses:
 *       200:
 *         description: List of roles in auth0
 *     tags:
 *      - roles
 *      - sync
 */
import { db } from "services/db";
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
      result.forEach(async (role) => {
        const local = await db.roles.findFirst({ where: { name: role.name } });
        if (local == null) {
          let addresult = await db.roles.create({
            data: {
              name: role.name,
              description: role.description,
              auth0_id: role.id,
            },
          });
        } else if (local.auth0_id == null) {
          let updateresult = await db.roles.update({
            where: {
              id: local.id,
            },
            data: {
              auth0_id: role.id,
            },
          });
        }
      });
      // const { user } = getSession(req, res);
      // const localUser = await db.user.findFirst({ where: { auth0_id: user.sub } })

      // record({module:"admin",component:"role",action:"sync",details:"", user_id:localUser.id})
      const method = req.method;
      var auth0 = new AuthenticationClient({
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
        clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
        audience: process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/",
        scope: "read:users",
      });
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
