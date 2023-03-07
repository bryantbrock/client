import { BoxProps, HStack } from "@chakra-ui/react";
import { Children, cloneElement, ReactNode, isValidElement } from "react";

type Props = { children: ReactNode } & BoxProps;

export const BorderedHStack = ({ children, rounded, ...props }: Props) => {
  const lenOfChildren = Children.count(children);
  const radiusInPx =
    rounded === "sm"
      ? "4px"
      : rounded === "md"
      ? "8px"
      : rounded === "lg"
      ? "12px"
      : "8px";

  return (
    <HStack spacing={0} w="full" {...props}>
      {Children.map(children, (child, idx) => {
        if (!isValidElement(child)) {
          return child;
        }

        return cloneElement(child as never, {
          borderWidth: idx === 0 ? "1px" : "1px 1px 1px 0px",
          borderRadius:
            idx === 0
              ? `${radiusInPx} ${lenOfChildren === 1 ? radiusInPx : "0px"} ${
                  lenOfChildren === 1 ? radiusInPx : "0px"
                } ${radiusInPx}`
              : idx + 1 === lenOfChildren
              ? `0px ${radiusInPx} ${radiusInPx} 0px`
              : "0px",
          _focus: { borderColor: "indigo.600", borderWidth: "1px" },
          transition: ".2s border-width ease-in-out",
        });
      })}
    </HStack>
  );
};
