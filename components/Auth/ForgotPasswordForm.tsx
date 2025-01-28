import React, { FC } from "react";
import * as yup from "yup";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  LightMode,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useAnalytics } from '../../contexts/AnalyticsContext';
import {
  AuthStatus,
  useAuthDispatch,
  useAuthState,
} from "../../context/AuthContext";

type ForgotPasswordFormProps = {
  // eslint-disable-next-line no-unused-vars
  callback({ email }: { email: string }): void;
};

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({ callback }) => {
  // const { logEvent } = useAnalytics();
  const { sessionStatus } = useAuthState();
  const { resetPassword, dispatch } = useAuthDispatch();
  const forgotPasswordSchema = yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required"),
  });
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (evt: any) => {
    const { email } = evt;

    // logEvent({
    //   action: 'forgot_password',
    //   category: 'Sign in'
    // });

    await resetPassword({ email });

    callback({ email });
  };

  const onCancel = async () => {
    dispatch({ type: "clearSession" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email */}
      <FormControl isInvalid={!!errors.email}>
        <FormLabel srOnly htmlFor="email">
          Email
        </FormLabel>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              size="lg"
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
        <FormHelperText color="gray.400" mt={4}>
          How to reset your password:
          <UnorderedList px="4" pt="2">
            <ListItem>Enter your registered email address.</ListItem>
            <ListItem>Click Reset Password.</ListItem>
            <ListItem>
              Check your inbox for an email with a verification code.
            </ListItem>
            <ListItem>
              Enter the verification code and your new password.
            </ListItem>
          </UnorderedList>
        </FormHelperText>
      </FormControl>

      <Flex align="center" justify="flex-start" mt="8">
        <Button variant="link" fontSize="sm" onClick={onCancel}>
          Cancel
        </Button>
      </Flex>

      <LightMode>
        <Button
          size="lg"
          type="submit"
          mt="8"
          w="full"
          colorScheme="brand"
          fontSize="md"
          fontWeight="bold"
          isLoading={
            isSubmitting || sessionStatus === AuthStatus.PENDING_RESET_PASSWORD
          }
          isDisabled={!!errors.email}
        >
          Reset password
        </Button>
      </LightMode>
    </form>
  );
};

export default ForgotPasswordForm;
