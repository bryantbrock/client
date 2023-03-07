import { db } from "services/db";

// prisma.$on("query", async (e) => {
//     console.log(`${e.query} ${e.params}`)
// })
export default async function handler(req, res) {
  const method = req.method;

  let result;
  switch (method) {
    case "GET":
      break;
    case "POST":
      const { client_id: clientID, searchText } = JSON.parse(req.body);

      // To get just the template / download document (not the final document)
      result = await prisma.document.findMany({
        where: {
          client_id: null,
          version: 1,
          parent_id: null,
          deleted: null,
          ...(searchText && { name: { contains: searchText } }),
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (result.length > 0) {
        let childs = [];

        for (let i = 0; i < result.length; i++) {
          // Retrieve only the child with the greatest version
          const child = await prisma.document.findMany({
            where: {
              client_id: null,
              parent_id: result[i].id,
              deleted: null,
            },
            orderBy: {
              version: "desc",
            },
            take: 1,
          });
          if (child.length > 0) {
            childs.push(...child);
          }
        }

        for (let i = 0; i < result.length; i++) {
          // just to append the field to answer
          result[i].final_document = null;

          const appendableChild = childs.filter(function (doc) {
            return doc.parent_id === result[i].id;
          });
          if (appendableChild.length > 0) {
            result[i].child = appendableChild[0];
          } else {
            result[i].child = null;
          }
        }

        let finalDocuments = [];
        if (clientID) {
          for (let i = 0; i < result.length; i++) {
            const finalDoc = await prisma.document.findMany({
              where: {
                client_id: clientID,
                parent_id: result[i].id,
                is_template: false,
                deleted: null,
              },
              orderBy: {
                version: "desc",
              },
              take: 1,
            });

            if (finalDoc.length > 0) {
              finalDocuments.push(...finalDoc);
            }
          }
        }

        if (finalDocuments.length > 0) {
          for (let i = 0; i < result.length; i++) {
            const appendableChild = finalDocuments.filter(function (doc) {
              return doc.parent_id === result[i].id;
            });
            if (appendableChild.length > 0) {
              result[i].final_document = appendableChild[0];
            } else {
              result[i].final_document = null;
            }
          }
        }
      }
      break;
    case "DELETE":
      break;
    case "PATCH":
      break;
    default:
      res.status(405).end(`Method ${method} not allowed`);
      break;
  }

  res.json(result);
}
