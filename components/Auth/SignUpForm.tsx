import React, { FC } from "react";
import * as yup from "yup";
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import NextLink from "next/link";
import { nameRegExp, passwordRegExp, phoneRegExp } from "../../libs/utils";
import {
  AuthStatus,
  useAuthDispatch,
  useAuthState,
} from "../../context/AuthContext";
// import { useAnalytics } from "../../contexts/AnalyticsContext";

const SignUpForm: FC = () => {
  // const { logEvent } = useAnalytics();
  const { signUp } = useAuthDispatch();
  const { sessionStatus, error } = useAuthState();
  const registerSchema = yup.object({
    password: yup
      .string()
      .matches(passwordRegExp, {
        message: (cur) => {
          const fails: string[] = [];
          if (!cur.value.match(/[a-z]/)) {
            fails.push("lowercase");
          }
          if (!cur.value.match(/[A-Z]/)) {
            fails.push("uppercase");
          }
          if (!cur.value.match(/[0-9]/)) {
            fails.push("number");
          }
          if (!cur.value.match(/[!@#$%^&*\-_.]/)) {
            fails.push("special character");
          }
          if (cur.value.match(/^(?=.*\s)/)) {
            fails.push("no spaces at the start or end");
          }

          return `Password must include ${fails.join(", ")}`;
        },
      })
      .min(8, "Minimum length is 8 characters")
      .required("Password is required"),
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
    fName: yup
      .string()
      .matches(
        nameRegExp,
        "It looks like your name contains invalid characters"
      )
      .required("First name is required"),
    lName: yup
      .string()
      .matches(
        nameRegExp,
        "It looks like your name contains invalid characters"
      ),
    // .required('Last name is required'),
    phone: yup
      .string()
      .matches(phoneRegExp, "Please use a valid number without spaces")
      .required("A Phone Number is required for speedy deliveries"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      fName: "",
      lName: "",
      phone: "",
    },
  });

  async function onSubmit(evt: any) {
    const { email, password, fName, lName, phone } = evt;

    await signUp({ email, fName, lName, password, phone });

    // logEvent({
    //   action: "signed_up",
    //   category: "Sign up",
    // });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex align="center" justify="flex-end" mb="8">
        <Button
          as={NextLink}
          href="/sign-in"
          variant="link"
          colorScheme="brand"
          fontSize="sm"
        >
          Already have an account?
        </Button>
      </Flex>

      {/* Errors */}
      {sessionStatus === AuthStatus.SIGN_UP_ERROR && (
        <Alert status="error" mb="4" borderRadius="md">
          <AlertIcon />
          {error?.message}
        </Alert>
      )}

      <Stack spacing={4} mb="2rem">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
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
            </FormControl>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                {...field}
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                size="lg"
                bg="bg-input"
                fontSize="md"
                placeholder="Password"
                focusBorderColor="brand.300"
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
          )}
        />

        <Controller
          name="fName"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.fName}>
              <FormLabel>First name</FormLabel>
              <Input
                {...field}
                id="fName"
                size="lg"
                name="fName"
                type="text"
                autoComplete="given-name"
                required
                placeholder="First name"
                bg="bg-input"
                fontSize="md"
                focusBorderColor="brand.300"
              />
            </FormControl>
          )}
        />

        <Controller
          name="lName"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.lName}>
              <FormLabel>Last name</FormLabel>
              <Input
                {...field}
                id="lName"
                size="lg"
                name="lName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                bg="bg-input"
                fontSize="md"
                focusBorderColor="brand.300"
              />
            </FormControl>
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.phone}>
              <FormLabel>Contact number</FormLabel>
              <Input {...field} placeholder="Contact number" size="lg" />
              <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <Button
          size="lg"
          type="submit"
          mt="8"
          w="full"
          colorScheme="red"
          fontSize="md"
          fontWeight="bold"
          isLoading={isSubmitting}
          isDisabled={Object.keys(errors).length > 0}
        >
          Sign Up
        </Button>
      </Stack>
    </form>
  );
};

export default SignUpForm;
