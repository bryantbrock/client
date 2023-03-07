import {
  DocumentVersion,
  Document as PrismaDocument,
  Tag as PrismaTag,
} from "@prisma/client";

export type Document = PrismaDocument & {
  tags: PrismaTag[];
  versions: DocumentVersion[];
};
