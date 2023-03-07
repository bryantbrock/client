import { QuickFilter, Tag, User } from "@prisma/client";
import { create } from "zustand";

type State = {
  value: Partial<
    User & {
      quickFilters?: (QuickFilter & { tags?: Tag[] })[];
      allowedTags?: Tag[];
      disabledTags?: Tag[];
    }
  > | null;
};

type Action = {
  update: (value: State["value"]) => void;
};

export const useOperatingAs = create<State & Action>((set) => ({
  value: null,
  update: (value: State["value"]) => set(() => ({ value })),
}));
