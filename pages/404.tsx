import { Box, Heading, Text, Link, HStack, Button } from "@chakra-ui/react";
import Image from "next/image";

function Custom404() {
  return (
    <Box
      bg="red.200"
      color="black"
      p={8}
      textAlign="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <HStack>
        <Image
          src="/images/number44.png"
          alt="404 Image"
          width={400}
          height={300}
        />
        <Image
          src="/images/logo.png"
          alt="404 Image"
          width={400}
          height={300}
        />
        <Image
          src="/images/number44.png"
          alt="404 Image"
          width={400}
          height={300}
        />
      </HStack>
      <Text fontSize="xl" mb={4}>
        Oops! Looks like you&apos;ve bitten off more that what you can chew.
      </Text>
      <Text fontSize="xl" mb={4}>
        Remember, it&apos;s not safe to eat things that aren&apos;t meant to be
        eaten!
      </Text>
      <Link href="/">
        <Button colorScheme="green">Go back to the homepage</Button>
      </Link>
      .
    </Box>
  );
}
export default Custom404;
