import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    indigo: {
      100: "#ebeafa",
      200: "#c3c1f1",
      300: "#9b97e7",
      400: "#736ede",
      500: "#4b44d4",
      600: "#322bbb",
      700: "#272191",
      800: "#1c1868",
      900: "#110e3e",
    },
    green: {
      100: "#e7fdef",
      200: "#b7face",
      300: "#88f7ad",
      400: "#58f48c",
      500: "#28f06b",
      600: "#0fd751",
      700: "#0ba73f",
      800: "#08772d",
      900: "#05481b",
    },
    red: {
      100: "ffe5e8",
      200: "#ffb3ba",
      300: "#ff808c",
      400: "#ff4d5e",
      500: "#ff1a30",
      600: "#e60017",
      700: "#b30012",
      800: "#80000d",
      900: "#4d0008",
    },
    blue: {
      100: "#eaf5fa",
      200: "#c1e2f1",
      300: "#97cfe7",
      400: "#6ebbde",
      500: "#44a8d4",
      600: "#2b8ebb",
      700: "#216f91",
      800: "#184f68",
      900: "#0e2f3e",
    },
    gray: {
      100: "#f1f3f3",
      200: "#d6dbdc",
      300: "#bac3c4",
      400: "#9facad",
      500: "#849495",
      600: "#6a7a7b",
      700: "#525f60",
      800: "#3b4445",
      900: "#232929",
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bgColor: "#322bbb",
          color: "white",
          borderRadius: "md",
          _hover: {
            bgColor: "#272191",
          },
        },
        secondary: {
          bgColor: "#28f06b",
          color: "#15126d",
          borderRadius: "md",
          _hover: {
            bgColor: "#0fd751",
          },
        },
        danger: {
          bgColor: "#b30012",
          color: "white",
          borderRadius: "md",
          _hover: {
            bgColor: "#80000d",
          },
        },
      },
    },
    Input: {
      defaultProps: { focusBorderColor: "#6a66e5" },
    },
    Switch: {
      defaultProps: { colorScheme: "indigo" },
    },
  },
});
