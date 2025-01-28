import React, { useState, FC } from "react";
import * as yup from "yup";
import { updatePassword } from "aws-amplify/auth";
import {
  Alert,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  AlertIcon,
  UnorderedList,
  ListItem,
  FormHelperText,
  Button,
  LightMode,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordRegExp } from "../../libs/utils";
import useToggle from "../../hooks/useToggle";

type NewPasswordFormProps = {
  // eslint-disable-next-line no-unused-vars
  callback(err: string | null, password?: string): void;
};

const NewPasswordForm: FC<NewPasswordFormProps> = ({ callback }) => {
  const [error, setError] = useState("");
  const [showPassword, toggleShowPassword] = useToggle(false);
  const newPasswordSchema = yup.object({
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
          if (cur.value.match(/^\s/)) {
            fails.push("no spaces at the start or end");
          }

          return `Password must include ${fails.join(", ")}`;
        },
      })
      .min(8, "Minimum length is 8 characters")
      .required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (evt: any) => {
    const { password } = evt;
    setError("");

    try {
      await updatePassword({ oldPassword: password, newPassword: password });

      callback(null);
    } catch (err: any) {
      console.error({ action: "newPassword", error: err });
      setError(err?.message);
    }
  };

  return (
    <>
      <Heading as="h3">Password change required</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Errors */}
        {error.length > 0 && (
          <Alert status="error" mb="4" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <FormControl isInvalid={!!errors.password}>
              <FormLabel srOnly>New Password</FormLabel>
              <InputGroup size="md">
                <Input
                  {...field}
                  id="password"
                  autoComplete="new-password"
                  required
                  size="lg"
                  bg="bg-input"
                  fontSize="md"
                  placeholder="New password"
                  focusBorderColor="brand.300"
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement width="4.5rem" mt="1" mr="3">
                  <Button h="1.75rem" size="sm" onClick={toggleShowPassword}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              <FormHelperText>
                Your password should contain the following:
                <UnorderedList px="4" pt="2">
                  <ListItem>minimum length of 8 characters</ListItem>
                  <ListItem>a numerical letter e.g. 123</ListItem>
                  <ListItem>a capital letter e.g. ABC</ListItem>
                  <ListItem>a lower case letter e.g. abc</ListItem>
                  <ListItem>a special character e.g. !@#$</ListItem>
                </UnorderedList>
              </FormHelperText>
            </FormControl>
          )}
        />

        <LightMode>
          <Button
            size="lg"
            type="submit"
            mt="8"
            w="full"
            colorScheme="brand"
            fontSize="md"
            fontWeight="bold"
            isLoading={isSubmitting}
            isDisabled={!!errors.password}
          >
            Change password
          </Button>
        </LightMode>
      </form>
    </>
  );
};

export default NewPasswordForm;
