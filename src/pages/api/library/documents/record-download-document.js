import record from "../../../../utils/recordAction";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { db } from "services/db";

export default withApiAuthRequired(async function handler(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "POST":
      try {
        const {
          object_id,
          is_template,
          parent_id,
          client_id, // int or null
          version,
        } = JSON.parse(req.body);
        // console.log(req.body)
        // return
        // Record Action
        const { user } = await getSession(req, res);

        // localUser --> Data base user
        const localUser = await prisma.user.findFirst({
          where: { auth0_id: user.sub },
        });

        // If downloading a new template document
        // conditions:
        //      parent_id === null
        //      client_id === null
        //      version === 1
        //  Validate if is_template or non-template document
        if (parent_id === null && client_id === null && version === 1) {
          record({
            module: "library",
            component: "documents",
            action: "download",
            details: is_template
              ? "Downloaded template v1 document."
              : "Downloaded non-template v1 document.",
            user_id: localUser.id,
            object_id: object_id,
          });
        }

        // If it is a new version of template document
        // conditions:
        //      parent_id !== null
        //      client_id === null
        if (parent_id !== null && client_id === null && version > 1) {
          record({
            module: "library",
            component: "documents",
            action: "download",
            details: is_template
              ? `Downloaded template v${version} document.`
              : `Downloaded non-template v${version} document.`,
            user_id: localUser.id,
            object_id: object_id,
          });
        }

        // If it is a final file for a client selected
        // conditions
        //      parent_id !== null
        //      client_id !== null
        if (parent_id !== null && client_id !== null) {
          // Validate version
          if (version === 1) {
            record({
              module: "library",
              component: "documents",
              action: "download",
              details: `Downloaded final file v1`,
              user_id: localUser.id,
              object_id: object_id,
              client_id: client_id,
            });
          }

          if (version > 1) {
            record({
              module: "library",
              component: "documents",
              action: "download",
              details: `Downloaded final file v${version}`,
              user_id: localUser.id,
              object_id: object_id,
              client_id: client_id,
            });
          }
        }
      } catch (error) {}
      break;
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }
});
