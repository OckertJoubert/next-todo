import React, { FC } from "react";
import { Box, BoxProps } from "@chakra-ui/react";

interface PageProps extends BoxProps {}

const Page: FC<PageProps> = ({ children, ...props }) => {
  return (
    <Box>
      <Box align="left" maxW="8xl" mx="auto" px={8} textAlign="left" {...props}>
        {children}
      </Box>
    </Box>
  );
};

export default Page;
