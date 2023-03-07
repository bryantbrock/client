import { chakra } from "@chakra-ui/react";
import NextImage from "next/image";

export const Image = chakra(NextImage, {
  shouldForwardProp: (prop) =>
    ["width", "height", "h", "w", "src", "alt"].includes(prop),
});
