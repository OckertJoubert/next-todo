import React, { useRef, useState } from "react";
import Router from "next/router";
import {
  confirmSignIn,
  resendSignUpCode,
  resetPassword,
} from "aws-amplify/auth";
import {
  Alert,
  AlertIcon,
  Button,
  FormLabel,
  HStack,
  PinInput,
  PinInputField,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  AuthStatus,
  useAuthDispatch,
  useAuthState,
} from "../../context/AuthContext";
// import { useAnalytics } from "../../context/AnalyticsContext";

type VerifyCodeFormProps = {
  type?:
    | "CONTINUE_SIGN_IN_WITH_MFA_SELECTION"
    | "CONTINUE_SIGN_IN_WITH_TOTP_SETUP"
    | "CONFIRM_SIGN_IN_WITH_SMS_CODE"
    | "CONFIRM_SIGN_IN_WITH_TOTP_CODE"
    | "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
    | "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    | "CONFIRM_SIGN_UP";
  user?: {
    username: string;
    password: string;
  };
  callback?: () => void;
};

function VerifyCodeForm({ type, user, callback }: VerifyCodeFormProps) {
  const toast = useToast();
  // const { logEvent } = useAnalytics();
  const { signUpConfirm, dispatch } = useAuthDispatch();
  const { sessionStatus } = useAuthState();
  const inputRef = useRef(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const grayColor = useColorModeValue("gray.500", "gray.500");
  const handleCodeUpdate = (value: string): void => {
    setCode(value);
  };

  const handleResendCode = async () => {
    setLoading(true);

    try {
      // Continue signup
      if (type === "CONFIRM_SIGN_UP") {
        await resendSignUpCode({ username: user?.username || "" });
      }

      // Everything else
      if (type !== "CONFIRM_SIGN_UP") {
        await resetPassword({ username: user?.username || "" });
      }

      setLoading(false);
      toast({
        title: "Resent email confirmation code.",
        description: `We've resent the email confirmation code to ${
          user?.username || ""
        }`,
        status: "info",
        variant: "solid",
        duration: 4000,
      });
    } catch (err: any) {
      setLoading(false);
      setError(
        err.message ||
          "Limit reached. Please wait a few minutes before trying again."
      );
    }
  };

  const handleCodeComplete = async (val: string) => {
    setError("");
    setLoading(true);

    // Continue signup
    if (type === "CONFIRM_SIGN_UP") {
      // TODO: Add option throwError?: boolean
      const resp = await signUpConfirm({
        code: val,
        email: user?.username,
      }).catch((err) => {
        console.error({
          action: "onConfirmCode:Auth.confirmSignUp:error",
          error: err,
        });
        setCode("");
        // TODO: Override errors in AuthContext
        // setError('Invalid code. Please use the latest email confirmation code and try again.');
        setLoading(false);
        // @ts-ignore
        inputRef.current?.focus();
      });

      // Let parent component know to Redirect to sign-in form
      // @ts-ignore
      if (resp?.nextStep?.signUpStep === "DONE" && callback) {
        callback();
      }

      // logEvent({
      //   action: "signed_up_confirmed",
      //   category: "Sign up confirmed",
      // });

      return;
    }

    // MFA
    if (type === "CONFIRM_SIGN_IN_WITH_TOTP_CODE") {
      // @ts-ignore
      const resp = await confirmSignIn({ challengeResponse: val }).catch(
        (err) => {
          console.error({
            action: "onConfirmCode:Auth.confirmSignInTotp:error",
            error: err,
          });
          dispatch({ type: "signInTotpError", error: err });
          setCode("");
          // TODO: Override errors in AuthContext
          // setError('Invalid code. Please use the latest email confirmation code and try again.');
          setLoading(false);
          // @ts-ignore
          inputRef.current?.focus();
        }
      );

      // Let parent component know to Redirect to sign-in form
      // @ts-ignore
      if (resp?.nextStep?.signUpStep === "DONE" && callback) {
        callback();
      }

      // logEvent({
      //   action: "signed_in_totp",
      //   category: "Signed in with TOTP",
      // });

      return;
    }

    // Everything else
    const codeConfirmed = await confirmSignIn({ challengeResponse: val }).catch(
      (err) => {
        console.error({
          action: "onConfirmCode:Auth.confirmSignIn:error",
          error: err,
        });
        setCode("");
        setError(
          "Invalid code. Please use the latest email confirmation code and try again."
        );
        setLoading(false);
        // @ts-ignore
        inputRef.current?.focus();
      }
    );

    // returned if not verified
    if (!codeConfirmed) {
      return;
    }

    // Route to account on successful login
    await Router.push("/pages/").catch((e) => {
      console.error({ action: "onEmailVerified:route:error", error: e });
      setError("Could not load account page");
    });
  };

  const handleTotpCancel = () => {
    dispatch({ type: "anonymousSession" });
  };

  return (
    <>
      {/* Errors */}
      {error.length > 0 && (
        <Alert status="error" mb="4" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Code */}
      {type !== "CONFIRM_SIGN_IN_WITH_TOTP_CODE" && (
        <FormLabel>Email verification code</FormLabel>
      )}
      {type === "CONFIRM_SIGN_IN_WITH_TOTP_CODE" && (
        <FormLabel>MFA verification code</FormLabel>
      )}
      <HStack mb={6}>
        <PinInput
          otp
          autoFocus
          value={code}
          type="number"
          variant="filled"
          colorScheme="whiteAlpha"
          size="lg"
          focusBorderColor="brand.300"
          // isDisabled={loading}   // Breaks autofocus
          // isInvalid={!!error}    // Interferes with other errors e.g. Resend pin limit
          onComplete={handleCodeComplete}
          onChange={handleCodeUpdate}
        >
          <PinInputField ref={inputRef} />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
        <Spinner
          display={
            loading || sessionStatus === AuthStatus.PENDING_SIGN_UP_CONFIRM
              ? "block"
              : "none"
          }
          color="brand.300"
        />
      </HStack>
      {type !== "CONFIRM_SIGN_IN_WITH_TOTP_CODE" && (
        <>
          <Text size="xs" color={grayColor}>
            Please use the code sent to your registered email address.
          </Text>
          <Text size="xs" color={grayColor}>
            <Button variant="link" onClick={handleResendCode}>
              Did not receive the email?
            </Button>
          </Text>
        </>
      )}
      {type === "CONFIRM_SIGN_IN_WITH_TOTP_CODE" && (
        <Text size="xs" color="gray.500">
          <Button variant="link" onClick={handleTotpCancel}>
            Cancel
          </Button>
        </Text>
      )}
    </>
  );
}

export default VerifyCodeForm;
