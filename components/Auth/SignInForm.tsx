import React from "react";
import * as yup from "yup";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useAnalytics } from '../../contexts/AnalyticsContext';
import { useAuthDispatch } from "../../context/AuthContext";

type LoginFormProps = {
  // eslint-disable-next-line no-unused-vars
  callback(
    err: string | null,
    user?: { username: string; password: string }
  ): void;
};

function SignInForm({ callback }: LoginFormProps) {
  // const { logEvent } = useAnalytics();
  const { signIn, dispatch } = useAuthDispatch();
  const loginSchema = yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (evt: any | undefined) => {
    const { email, password } = evt;
    const { isSignedIn, nextStep } = await signIn({ email, password });

    // Forced password reset on new account login
    if (!isSignedIn && nextStep?.signInStep) {
      callback(nextStep?.signInStep, { username: email, password });
      return;
    }

    // logEvent({
    //   action: "signed_in",
    //   category: "Sign in",
    // });
  };

  const onForgotPassword = () => {
    dispatch({ type: "resetPassword" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* Email */}
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                size="lg"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                bg="bg-input"
                fontSize="md"
                focusBorderColor="brand.300"
              />
            )}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>

        {/* Password */}
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                size="lg"
                bg="bg-input"
                fontSize="md"
                placeholder="Password"
                focusBorderColor="brand.300"
              />
            )}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
      </Stack>

      <Flex align="center" justify="space-between" mt="8">
        <Spacer />
        {/* TODO: */}
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Button
          variant="link"
          colorScheme="brand"
          fontSize="sm"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </Button>
      </Flex>

      <Button
        size="lg"
        type="submit"
        mt="8"
        w="full"
        fontSize="md"
        fontWeight="bold"
        isLoading={isSubmitting}
        isDisabled={Object.keys(errors).length > 0}
      >
        Sign in
      </Button>
      <Text fontSize="xs" color={mode("gray.600", "gray.400")} mt="8">
        By continuing, you acknowledge that you have read, understood, and agree
        to our terms and conditions.
      </Text>
    </form>
  );
}

export default SignInForm;
