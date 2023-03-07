import { Image } from "components/Image";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { getSession } from "@auth0/nextjs-auth0";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }

  return { props: {} };
};

export default function Entry() {
  return (
    <Flex direction="column" minH="100vh">
      <Flex
        direction="column"
        gap="10px"
        flex="1"
        justify="center"
        align="center"
      >
        <Text fontSize="4xl" fontWeight="bold" textAlign="center">
          <Image
            width="350"
            height="85"
            alt="Streamline Scientific"
            src="/images/streamline_logo.png"
          />
          <br />
          Client Portal
        </Text>

        <Button variant="secondary" as="a" href="/api/auth/login" w="100px">
          Login
        </Button>
      </Flex>

      <Box as="footer">
        <Flex
          p={10}
          width="100vw"
          height="full"
          borderTop="1px solid #eaeaea"
          justifyContent="center"
          alignItems="center"
        >
          Powered by Streamline Scientific
        </Flex>
      </Box>
    </Flex>
  );
}
