import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import Router, { useRouter } from "next/router";
import SignInForm from "../components/Auth/SignInForm";
import VerifyCodeForm from "../components/Auth/VerifyCodeForm";
import NewPasswordForm from "../components/Auth/NewPasswordForm";
import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";
import {
  AuthStatus,
  useAuthDispatch,
  useAuthState,
} from "../context/AuthContext";
import Page from "../components/Page";
import { Loading } from "../components/Loading";
import { Footer } from "../components/Footer";
import NavBar from "../components/NavBar";

// eslint-disable-next-line no-unused-vars
enum FormStates {
  // eslint-disable-next-line no-unused-vars
  NEW_PASSWORD,
  // eslint-disable-next-line no-unused-vars
  CONFIRM_EMAIL,
}

const SignIn: FC = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, sessionStatus, error } = useAuthState();
  const { dispatch } = useAuthDispatch();
  const [tmpUser, setTmpUser]: [any, any] = useState({});
  const [formState, setFormState] = useState<FormStates>();

  // Redirect to account page on sign-in
  useEffect(() => {
    console.log({
      isAuthenticated,
      isLoading,
      sessionStatus,
      error,
    });
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
  }, [isAuthenticated, isLoading]);

  const clearSession = () => {
    dispatch({ type: "clearSession" });
  };

  async function onLogin(nextStep: string, user: any) {
    setTmpUser(user);

    if (nextStep) {
      if (nextStep === "NEW_PASSWORD_REQUIRED") {
        setFormState(FormStates.NEW_PASSWORD);
        return;
      }

      if (nextStep === "UserNotConfirmedException") {
        setFormState(FormStates.CONFIRM_EMAIL);
      }
    }
  }

  const getAuthStep = useCallback(() => {
    let step: React.ReactNode;
    switch (sessionStatus) {
      case AuthStatus.ANONYMOUS:
      case AuthStatus.SIGN_IN_ERROR:
      case AuthStatus.PENDING_SIGN_IN:
        // eslint-disable-next-line react/jsx-no-bind
        step = <SignInForm callback={onLogin} />;
        break;
      case AuthStatus.SIGN_UP_CONFIRM:
      case AuthStatus.PENDING_SIGN_UP_CONFIRM:
      case AuthStatus.SIGN_UP_CONFIRM_ERROR:
        step = (
          <VerifyCodeForm
            type="CONFIRM_SIGN_UP"
            user={tmpUser}
            callback={clearSession}
          />
        );
        break;

      case AuthStatus.SIGN_IN_TOTP:
      case AuthStatus.PENDING_SIGN_IN_TOTP:
      case AuthStatus.SIGN_IN_TOTP_ERROR:
        step = (
          <VerifyCodeForm
            type="CONFIRM_SIGN_IN_WITH_TOTP_CODE"
            user={tmpUser}
            callback={clearSession}
          />
        );
        break;

      // Reset password
      case AuthStatus.RESET_PASSWORD:
      case AuthStatus.PENDING_RESET_PASSWORD:
      case AuthStatus.RESET_PASSWORD_ERROR:
        step = <ForgotPasswordForm callback={setTmpUser} />;
        break;

      // Reset password confirm
      case AuthStatus.RESET_PASSWORD_CONFIRM:
      case AuthStatus.PENDING_RESET_PASSWORD_CONFIRM:
      case AuthStatus.RESET_PASSWORD_CONFIRM_ERROR:
        step = <ResetPasswordForm email={tmpUser?.email} />;
        break;

      default:
        step = <Loading />;
    }

    return step;
  }, [sessionStatus, tmpUser]);

  return (
    <Page
      seoOptions={{
        title: "Sign in | donoteat",
        description: "Sign in page for donoteat",
        canonical: "https://donoteat/sign-in/",
      }}
      showNav={false}
      maxW="100%"
      p={0}
      m={0}
    >
      <>
        <NavBar />

        <Flex
          direction={{ base: "column", md: "row" }}
          overflow="hidden"
          justifyContent="center"
        >
          <Flex flexDir="row">
            <Flex
              display={{ base: "none", md: "block" }}
              flexDir="column"
              maxW="50%"
              py="16"
              px="20"
              alignItems="self-start"
            >
              {/* <Text color={mode('gray.900', 'white')} mb='10'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id neque eros. Quisque nec enim ac felis
              eleifend tempor.
            </Text> */}
              <HStack h="50%"></HStack>
            </Flex>
            <Box
              overflowY="auto"
              flex="1"
              py={{ base: "10", md: "16" }}
              px={{ base: "6", md: "10" }}
            >
              <Box maxW="sm" mx="auto">
                <Box textAlign="center" mb={{ base: "10", md: "16" }}>
                  <Heading
                    as="h1"
                    size="md"
                    fontWeight="extrabold"
                    letterSpacing="tight"
                  >
                    Sign in to your account
                  </Heading>
                  <Text
                    mt="3"
                    color={mode("gray.600", "gray.400")}
                    fontWeight="medium"
                  >
                    {`Don't have an account? `}
                    <Button
                      variant="link"
                      colorScheme="red.200"
                      onClick={() => Router.push("/sign-up")}
                    >
                      Sign up
                    </Button>
                  </Text>
                </Box>
                {/* Errors */}
                {error && (
                  <Alert status="error" mb="4" borderRadius="md">
                    <AlertIcon />
                    {error?.message}
                  </Alert>
                )}

                {/* Auth step */}
                {getAuthStep()}
                {/* Additional steps */}
                {formState === FormStates.CONFIRM_EMAIL && (
                  <VerifyCodeForm user={tmpUser} callback={clearSession} />
                )}
                {formState === FormStates.NEW_PASSWORD && (
                  <NewPasswordForm callback={clearSession} />
                )}
              </Box>
            </Box>
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
export default SignIn;
