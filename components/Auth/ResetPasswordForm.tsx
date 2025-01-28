import React, { FC } from "react";
import * as yup from "yup";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  PinInput,
  PinInputField,
  Stack,
  Text,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordRegExp } from "../../libs/utils";
import useToggle from "../../hooks/useToggle";
import {
  AuthStatus,
  useAuthDispatch,
  useAuthState,
} from "../../context/AuthContext";

type ResetPasswordFormProps = {
  email: string;
};

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ email }) => {
  const [showPassword, toggleShowPassword] = useToggle(false);
  const toast = useToast();
  const { resetPassword, resetPasswordConfirm, dispatch } = useAuthDispatch();
  const { sessionStatus } = useAuthState();
  const onResetPasswordSchema = yup.object({
    code: yup
      .string()
      .matches(/^\d{6}$/, "Not a valid code")
      .required("Verification code is required"),
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
          if (!cur.value.match(/[!@#$%^&*]/)) {
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
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(onResetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  const onCancel = () => {
    dispatch({ type: "clearSession" });
  };

  const onResendConfirmation = async () => {
    await resetPassword({ email });

    toast({
      title: "Resent email confirmation code.",
      description: `We've resent the email confirmation code to ${email}`,
      status: "info",
      variant: "solid",
      duration: 4000,
    });
  };

  const onSubmit = (evt: any) => {
    const { password, code } = evt;

    resetPasswordConfirm({ code, newPassword: password });
  };

  return (
    <>
      <Text
        textAlign="center"
        color="gray.500"
        mb={4}
        className="text-center grey-subtitle mb-4"
      >
        Reset your password using the verification code received via email.
      </Text>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          {/* Code */}
          <FormControl isInvalid={!!errors.code}>
            <FormLabel htmlFor="code">Verification code</FormLabel>
            <Controller
              name="code"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <HStack>
                  <PinInput
                    otp
                    autoFocus
                    value={value}
                    type="number"
                    variant="filled"
                    colorScheme="red"
                    size="lg"
                    focusBorderColor="brand.300"
                    onComplete={(val) => onChange(val)}
                    onChange={(val) => onChange(val)}
                  >
                    <PinInputField ref={ref} />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              )}
            />
            <FormErrorMessage>
              {errors.code && errors.code.message}
            </FormErrorMessage>
            <FormHelperText color="gray.400">
              You will receive a 6 digit code via email.
            </FormHelperText>
          </FormControl>

          {/* Password */}
          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">New Password</FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputGroup size="md">
                  <Input
                    {...field}
                    id="password"
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
                    <Button
                      colorScheme="brand"
                      h="1.75rem"
                      size="sm"
                      onClick={() => toggleShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              )}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
            <FormHelperText color="gray.400">
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
        </Stack>

        <Flex align="center" justify="space-between" mt="8">
          <Button
            variant="link"
            colorScheme="brand"
            fontSize="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="link"
            colorScheme="brand"
            fontSize="sm"
            onClick={onResendConfirmation}
          >
            Did not receive a verification code?
          </Button>
        </Flex>

        <Button
          size="lg"
          type="submit"
          mt="8"
          w="full"
          colorScheme="brand"
          fontSize="md"
          fontWeight="bold"
          isLoading={
            sessionStatus === AuthStatus.PENDING_RESET_PASSWORD_CONFIRM
          }
          isDisabled={!!errors.code || !!errors.password}
        >
          Change password
        </Button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
