import { Flex, Heading, Spinner } from "@chakra-ui/react";

type LoadingProps = {
  text?: string;
  bgColor?: string;
};

export const Loading: React.FC<LoadingProps> = ({ text, bgColor }) => {
  return (
    <>
      <Spinner />
      <Flex
        w="100%"
        h="100vh"
        justify="center"
        align="center"
        direction="column"
        bg={bgColor}
      >
        <Heading as="h1" size="lg" color="white">
          {text}
        </Heading>
      </Flex>
    </>
  );
};
// Compare this snippet from components/Loading.tsx:
