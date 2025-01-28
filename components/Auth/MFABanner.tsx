import React, { FC, useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import { fetchMFAPreference } from "aws-amplify/auth";
import { useAuthState } from "../../context/AuthContext";

const Settings: FC = () => {
  const { isAuthenticated } = useAuthState();
  const [showMFABanner, setShowMFABanner] = useState(false);

  const checkMFAStatus = async () => {
    const { enabled } = await fetchMFAPreference();
    if (!enabled) {
      setShowMFABanner(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      checkMFAStatus();
    }
  }, [isAuthenticated]);

  if (!showMFABanner) return null;

  return (
    <Alert
      colorScheme="gray"
      bgColor="gray.200"
      _dark={{ bgColor: "bg-surface" }}
      mb={8}
      style={{ borderRadius: "5px" }}
    >
      <Icon fontSize="2rem" as={FiAlertCircle} mr={4} color="bg-subtle" />
      <Box
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <AlertTitle>Please configure MFA</AlertTitle>
          <AlertDescription maxWidth={["sm", "md", "lg"]}>
            Secure your account. Set up MFA for added protection!
          </AlertDescription>
        </Box>
        <Box>
          <Link href="/settings/">
            <Button>Configure MFA</Button>
          </Link>
        </Box>
      </Box>
    </Alert>
  );
};

export default Settings;
