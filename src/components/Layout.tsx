import { ReactNode } from "react";
import {
  Box,
  Link,
  Flex,
  Text,
  useBreakpoint,
  Divider,
  Button,
} from "@chakra-ui/react";
import { useUser } from "hooks/useUser";
import { Image } from "./Image";
import { useRouter } from "next/router";
import Head from "next/head";
import NextLink from "next/link";
import capitalize from "lodash/capitalize";
import { User } from "@prisma/client";
import { FolderIcon } from "./icons/FolderIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { CircleStackIcon } from "./icons/CircleStackIcon";

const mainLinks = [
  { path: "dashboard", icon: <HomeIcon color="white" h="24px" /> },
  { path: "documents", icon: <FolderIcon color="white" h="24px" /> },
  { path: "orders", icon: <CircleStackIcon color="white" h="24px" /> },
];
const moreLinks = [
  { path: "reports" },
  { path: "training" },
  { path: "support" },
];

const SidebarLink = ({
  path,
  icon,
  isActive,
}: {
  path: string;
  icon?: ReactNode;
  isActive?: boolean;
}) => {
  const breakpoint = useBreakpoint();
  const showIconSidebar = ["sm", "md"].includes(breakpoint);
  const hideSidebar = ["base"].includes(breakpoint);

  return (
    <Link as={NextLink} href={`/${path}`} _hover={{ textDecoration: "none" }}>
      <Flex
        gap={4}
        align="center"
        py={2}
        mb={1}
        mx={{ base: 2, lg: 5 }}
        rounded="lg"
        px={3}
        bgColor={isActive ? "indigo.600" : undefined}
        transition=".2s background-color ease-in-out"
        _hover={{ bgColor: "indigo.600" }}
      >
        {icon}
        {!showIconSidebar && !hideSidebar ? (
          <Text color="white" fontWeight="semibold">
            {capitalize(path)}
          </Text>
        ) : null}
      </Flex>
    </Link>
  );
};

export const Layout = ({ children }: { children?: ReactNode }) => {
  const { user, isLoading } = useUser();
  const isLoggedIn = !!user?.id;
  const { pathname } = useRouter();
  const [endpoint] = pathname.split("/").reverse();

  const breakpoint = useBreakpoint();
  const showIconSidebar = ["sm", "md"].includes(breakpoint);
  const hideSidebar = ["base"].includes(breakpoint);

  if (isLoading) {
    return <Box />;
  }

  return (
    <Box>
      <Head>
        <title>Streamline Scientific Client Portal</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      {isLoggedIn && !hideSidebar ? (
        <Box position="relative">
          <Flex
            bgColor="indigo.800"
            position="fixed"
            direction="column"
            borderRadius="2xl"
            h="calc(100vh - 16px)"
            m={2}
          >
            {!showIconSidebar ? (
              <Link
                as={NextLink}
                href="/dashboard"
                p={10}
                w={{ base: "0px", sm: "60px", lg: "240px" }}
              >
                <Image
                  width="164"
                  height="41"
                  alt="Streamline Scientific"
                  src="/images/streamline_logo_white.png"
                />
              </Link>
            ) : null}

            <Flex direction="column" mt={2} flexGrow="1">
              {mainLinks.map((link, idx) => (
                <SidebarLink
                  isActive={endpoint === link.path}
                  path={link.path}
                  icon={link.icon}
                  key={link.path}
                />
              ))}
              {!showIconSidebar ? (
                <Box m={6} pl={3} pr={16}>
                  <Divider borderColor="indigo.300" rounded="lg" />
                </Box>
              ) : null}
              {moreLinks.map((link) => (
                <SidebarLink
                  isActive={endpoint === link.path}
                  path={link.path}
                  key={link.path}
                />
              ))}
            </Flex>
            {!showIconSidebar ? (
              <Button
                color="white"
                textAlign="center"
                mb={4}
                mx="auto"
                w="fit-content"
                variant="outline"
                _hover={{ bgColor: "indigo.900" }}
              >
                Logout
              </Button>
            ) : null}
            {!showIconSidebar ? (
              <Text
                fontSize="xs"
                color="white"
                w="full"
                textAlign="center"
                mb={4}
              >
                Powered by Streamline Scientific
              </Text>
            ) : null}
          </Flex>
        </Box>
      ) : null}

      <Box
        flexGrow="1"
        ml={isLoggedIn ? { base: "0px", sm: "80px", lg: "240px" } : undefined}
        overflowY="scroll"
      >
        {children}
      </Box>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          overscroll-behavior: none;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </Box>
  );
};
