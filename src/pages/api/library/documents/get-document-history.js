import record from "../../../../utils/recordAction";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { db } from "services/db";

export default withApiAuthRequired(async function handler(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "POST":
      try {
        const { id } = JSON.parse(req.body);
        // Get the asked file
        const askedDocument = await prisma.document.findUnique({
          where: {
            id: Number(id),
          },
        });

        let allDocuments = [];

        // T E M P L A T E  -  D O C U M E N T S

        //Get previous or later files
        // Template documents
        // If !parent_id && !client_id && version === 1
        // we are talking about v1 of a template document
        // retrieve all template childs to get child documents ids
        if (
          !askedDocument.parent_id &&
          !askedDocument.client_id &&
          askedDocument.version === 1
        ) {
          // Obtain all the documents where parent_id === askedDocument.id
          const remainDocuments = await prisma.document.findMany({
            where: {
              parent_id: askedDocument.id,
              client_id: null,
            },
          });

          allDocuments = [askedDocument, ...remainDocuments];
          // console.log(allDocuments)
        }

        // if !parent_id && !client_id && version > 1
        // we are talking about a template document version grater than 1

        // must retrieve old documents till get to parent
        if (
          askedDocument.parent_id &&
          !askedDocument.client_id &&
          askedDocument.version > 1
        ) {
          // Because of ui, we are assuming that is the latest version
          // so we will retrieve backwards
          const remainDocuments = await prisma.document.findMany({
            where: {
              parent_id: askedDocument.parent_id,
              client_id: null,
              NOT: {
                id: askedDocument.id,
              },
            },
          });

          const originalDocument = await prisma.document.findUnique({
            where: {
              id: askedDocument.parent_id,
            },
          });

          allDocuments = [askedDocument, ...remainDocuments, originalDocument];
        }

        // F I N A L  -  D O C U M E N T S

        // if parent_id and client_id is a final version
        // so retrieve backwards
        if (askedDocument.parent_id && askedDocument.client_id) {
          const remainDocuments = await prisma.document.findMany({
            where: {
              parent_id: askedDocument.parent_id,
              client_id: askedDocument.client_id,
              NOT: {
                id: askedDocument.id,
              },
            },
          });

          allDocuments = [askedDocument, ...remainDocuments];
        }

        const objectIds = allDocuments.map((obj) => obj.id);

        result = await prisma.Action.findMany({
          where: {
            module: "library",
            component: "documents",
            object_id: {
              in: objectIds,
            },
          },
          include: {
            user: true,
          },
          orderBy: {
            timestamp: "desc",
          },
        });
      } catch (error) {}
      break;
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }

  res.json(result);
});
