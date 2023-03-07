import { db } from "services/db";
import { Prisma as PrismaDef } from "@prisma/client";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import record from "../../../../utils/recordAction";

// prisma.$on("query", async (e) => {
//     console.log(`${e.query} ${e.params}`)
// })
export default withApiAuthRequired(async function handler(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "POST":
      try {
        const {
          name,
          description,
          is_template,
          parent_id,
          client_id,
          path,
          tags,
          version,
        } = JSON.parse(req.body);

        result = await prisma.Document.create({
          data: {
            name,
            description,
            is_template,
            parent_id,
            client_id,
            path,
            version,
          },
        });

        if (tags) {
          tags.forEach(async (tag) => {
            await prisma.DocumentToTags.create({
              data: {
                document_id: result.id,
                tag_id: tag.id,
              },
            });
          });
        }

        // Record Action
        const { user } = await getSession(req, res);

        // localUser --> Data base user
        const localUser = await prisma.user.findFirst({
          where: { auth0_id: user.sub },
        });
        // console.log(localUser)

        //  If it is a new template document
        // conditions:
        //      parent_id === null
        //      client_id === null
        //      version === 1
        //  Validate if is_template or non-template document
        if (parent_id === null && client_id === null && version === 1) {
          record({
            module: "library",
            component: "documents",
            action: is_template
              ? "New template document"
              : "New non-template document",
            details: is_template
              ? "Created a new template document (v1)"
              : "Created a new non-template document (v1)",
            user_id: localUser.id,
            object_id: result.id,
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
            action: "upload",
            details: is_template
              ? `Uploaded a new template document (v${version})`
              : `Uploaded a new non-template document (v${version})`,
            user_id: localUser.id,
            object_id: result.id,
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
              action: "upload",
              details: "Created a new final file document (v1)",
              user_id: localUser.id,
              object_id: result.id,
              client_id: client_id,
            });
          }

          if (version > 1) {
            record({
              module: "library",
              component: "documents",
              action: "upload",
              details: `Uploaded a new final file document version (v${version})`,
              user_id: localUser.id,
              object_id: result.id,
              client_id: client_id,
            });
          }
        }

        res.status(200).json({
          success: true,
          data: result,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      break;
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }
});
