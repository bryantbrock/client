import { useState } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "services/theme";
import { Layout } from "components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
