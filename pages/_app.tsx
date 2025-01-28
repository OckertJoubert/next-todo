import { DefaultSeo } from "next-seo";
import * as React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "../libs/theme";
import { Amplify } from "aws-amplify";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AuthProvider } from "../context/AuthContext";
import { fetchAuthSession } from "aws-amplify/auth";
import Script from "next/script";

interface AppProps {
  Component?: any;
  pageProps?: any;
}

/* AWS Amplify and Appsync */
const APPSYNC_URL = process.env.NEXT_PUBLIC_APP_SYNC_API_URL;
const httpLink = createHttpLink({
  uri: APPSYNC_URL,
});
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  } catch (err) {
    console.error("Auth session token error", err);
    return {
      headers: {
        ...headers,
      },
    };
  }
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Copied and variable-ised settings from src/aws-exports.js. Check for changes when changing amplify
const config = {
  aws_project_region: process.env.NEXT_PUBLIC_REGION,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
  oauth: {},
  aws_cognito_username_attributes: ["EMAIL"],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ["EMAIL"],
  aws_cognito_mfa_configuration: "OPTIONAL",
  aws_cognito_mfa_types: [],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ["EMAIL"],
  aws_user_files_s3_bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
  aws_user_files_s3_bucket_region: process.env.NEXT_PUBLIC_REGION,
};

Amplify.configure(config);
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  // const proTheme = extendTheme(theme);
  // const extendedConfig = {
  //   colors: { ...proTheme.colors, brand: proTheme.colors.teal },
  // };
  // const myTheme = extendTheme(extendedConfig, proTheme);

  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo
        title="Do Not Eat"
        description="Do Not Eat"
        openGraph={{
          type: "website",
          locale: "en_GB",
          url: "https://donoteat.co.za/",
          site_name: "DoNotEat",
          images: [
            {
              url: "https://donoteat.co.za/images/logo.jpg",
              width: 800,
              height: 600,
              alt: "logo",
            },
            {
              url: "https://donoteat.co.za/images/pear.jpg",
              width: 1200,
              height: 900,
              alt: "pear",
            },
          ],
        }}
      />
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script id="ga-analytics">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
  
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
      `}
      </Script>

      <ApolloProvider client={client as any}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ApolloProvider>
    </ChakraProvider>
  );
};

export default App;
