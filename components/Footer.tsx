import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { ReactNode } from "react";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export const Footer = () => {
  return (
    <Box
      as="footer"
      width="100%"
      mt="auto"
      py={4}
      bg="gray.800"
      color="white"
      textAlign="center"
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>{`©  ${new Date().getFullYear()}. All rights reserve`}</Text>
        <Stack direction={"row"} spacing={6}>
          <SocialButton label={"Twitter"} href={"/DONOTEAT"}>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={"YouTube"} href={"/DONOTEAT"}>
            <FaYoutube />
          </SocialButton>
          <SocialButton label={"Instagram"} href={"/DONOTEAT"}>
            <FaInstagram />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
};
