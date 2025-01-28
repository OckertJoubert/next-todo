import React, { FC, useCallback, useEffect } from "react";
import { Alert, AlertIcon, Box, Flex, Heading } from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import VerifyCodeForm from "../components/Auth/VerifyCodeForm";
import SignUpForm from "../components/Auth/SignUpForm";
import {
  AuthStatus,
  useAuthDispatch,
  useAuthState,
} from "../context/AuthContext";
import Page from "../components/Page";
import { Loading } from "../components/Loading";

import { Footer } from "../components/Footer";
import NavBar from "../components/NavBar";

const SignUp: FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, sessionStatus, error } = useAuthState();
  const { dispatch } = useAuthDispatch();

  // Redirect to account after signup
  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Redirect after
    if (isAuthenticated) {
      router.push("/pages/");
      return;
    }

    // Set default state
    dispatch({ type: "clearSession" });
  }, [isAuthenticated]);

  const getAuthStep = useCallback(() => {
    let step: React.ReactNode;
    switch (sessionStatus) {
      // Sign-up form
      case AuthStatus.ANONYMOUS:
      case AuthStatus.PENDING_SIGN_UP:
      case AuthStatus.SIGN_UP_ERROR:
      case AuthStatus.SIGN_IN_ERROR:
      case AuthStatus.SIGN_IN_TOTP_ERROR:
      case AuthStatus.RESET_PASSWORD_ERROR:
      case AuthStatus.RESET_PASSWORD_CONFIRM_ERROR:
        step = <SignUpForm />;
        break;

      // Verify sign-up
      case AuthStatus.SIGN_UP_CONFIRM:
      case AuthStatus.PENDING_SIGN_UP_CONFIRM:
      case AuthStatus.SIGN_UP_CONFIRM_ERROR:
        step = <VerifyCodeForm type="CONFIRM_SIGN_UP" />;
        break;

      default:
        step = <Loading />;
    }

    return step;
  }, [sessionStatus]);

  function goToAccountPage() {
    Router.push("/pages/");
  }

  return (
    <Page
      seoOptions={{
        title: "Sign up | donoteat",
        description: "",
        canonical: "https://donoteat/sign-up/",
        noindex: true,
        nofollow: true,
      }}
      showNav={false}
      maxW="100%"
      p={0}
      m={0}
    >
      <>
        {isAuthenticated && goToAccountPage()}
        <NavBar />

        <Flex
          direction={{ base: "column", md: "row" }}
          overflow="hidden"
          minH="100vh"
          height="100%"
          justifyContent="center"
        >
          <Box
            overflowY="auto"
            flex="1"
            py={{ base: "10" }}
            px={{ base: "6", md: "10" }}
          >
            <Box mx="auto">
              <Box
                overflowY="auto"
                flex="1"
                py={{ base: "10", md: "16" }}
                px={{ base: "6", md: "10" }}
              >
                <Box maxW="sm" mx="auto">
                  <Box textAlign="center" mb={{ base: "4", md: "6" }}>
                    <Heading
                      as="h1"
                      size="lg"
                      fontWeight="extrabold"
                      letterSpacing="tight"
                    >
                      {sessionStatus !== AuthStatus.SIGN_UP_CONFIRM &&
                        "Sign up for an account"}
                      {sessionStatus === AuthStatus.SIGN_UP_CONFIRM &&
                        "Verify account email"}
                    </Heading>
                  </Box>

                  {/* Errors */}
                  {sessionStatus === AuthStatus.SIGN_UP_ERROR ||
                    (sessionStatus === AuthStatus.SIGN_UP_CONFIRM_ERROR && (
                      <Alert status="error" mb="4" borderRadius="md">
                        <AlertIcon />
                        {error?.message}
                      </Alert>
                    ))}

                  {/* Auth steps */}
                  {getAuthStep()}
                </Box>
              </Box>
            </Box>
          </Box>
          <Flex
            display={{ base: "none", md: "block" }}
            flexDir="column"
            maxW="50%"
            py="16"
            px="20"
            alignItems="self-start"
          >
            {/* <HStack spacing={0} mb='6'> */}
            {/* <Text fontWeight='bold' fontSize='2xl' color={mode('black', 'white')} mb='2'>
              Chicken Little
            </Text> */}
            {/* </HStack> */}
            {/* <Text color={mode('black', 'white')} mb='10'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id neque eros. Quisque nec enim ac felis
            eleifend tempor.
          </Text> */}
            {/* <SVGComponent width="100%" /> */}
          </Flex>
        </Flex>
        {/* Footer */}
        <Box>
          <Box maxW="8xl" mx="auto" p={8} textAlign="left">
            <Footer />
          </Box>
        </Box>
      </>
    </Page>
  );
};

export default SignUp;
