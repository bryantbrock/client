import { PrismaClient } from "@prisma/client";
import roles from "./fixtures/roles.json";
import users from "./fixtures/users.json";
import tagGroups from "./fixtures/tagGroups.json";
import tags from "./fixtures/tags.json";
import documents from "./fixtures/documents.json";
import documentVersions from "./fixtures/documentVersions.json";
import quickFilters from "./fixtures/quickFilters.json";

const prisma = new PrismaClient();

async function main() {
  await Promise.all(roles.map((data) => prisma.role.create({ data })));
  await Promise.all(users.map((data) => prisma.user.create({ data })));
  await Promise.all(tagGroups.map((data) => prisma.tagGroup.create({ data })));
  // @ts-ignore
  await Promise.all(tags.map((data) => prisma.tag.create({ data })));
  // @ts-ignore
  await Promise.all(documents.map((data) => prisma.document.create({ data })));
  await Promise.all(
    // @ts-ignore
    documentVersions.map((data) => prisma.documentVersion.create({ data }))
  );
  await Promise.all(
    quickFilters.map((data) => prisma.quickFilter.create({ data }))
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
