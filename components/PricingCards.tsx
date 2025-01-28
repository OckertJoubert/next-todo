import { ReactNode } from "react";
import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Button,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

function PriceWrapper({ children }: { children: ReactNode }) {
  return (
    <Box
      mb={4}
      shadow="base"
      borderWidth="1px"
      alignSelf={{ base: "center", lg: "flex-start" }}
      borderColor={useColorModeValue("green.200", "green.500")}
      borderRadius={"xl"}
    >
      {children}
    </Box>
  );
}

export const PricingCards = () => {
  return (
    <Box py={12}>
      <VStack spacing={2} textAlign="center">
        <Heading as="h1" fontSize="4xl">
          grayify Plans for Every Gardener
        </Heading>
        <Text fontSize="lg" color={"green.500"}>
          Start with 14-day free trial. No credit card needed. Cancel at
          anytime.
        </Text>
      </VStack>
      <Stack
        direction={{ base: "column", md: "row" }}
        textAlign="center"
        justify="center"
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl">
              Seedling
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                $
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                79
              </Text>
              <Text fontSize="3xl" color="green.500">
                /month
              </Text>
            </HStack>
          </Box>
          <VStack
            bg={useColorModeValue("green.50", "green.700")}
            py={4}
            borderBottomRadius={"xl"}
          >
            <List spacing={3} textAlign="start" px={12}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Track up to 50 plants
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Basic plant care reminders
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Access to plant care community
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="gray" variant="outline">
                Start trial
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>

        <PriceWrapper>
          <Box position="relative">
            <Box
              position="absolute"
              top="-16px"
              left="50%"
              style={{ transform: "translate(-50%)" }}
            >
              <Text
                textTransform="uppercase"
                bg={useColorModeValue("green.300", "green.700")}
                px={3}
                py={1}
                color={useColorModeValue("green.900", "green.300")}
                fontSize="sm"
                fontWeight="600"
                rounded="xl"
              >
                Most Popular
              </Text>
            </Box>
            <Box py={4} px={12}>
              <Text fontWeight="500" fontSize="2xl">
                gray Thumb
              </Text>
              <HStack justifyContent="center">
                <Text fontSize="3xl" fontWeight="600">
                  $
                </Text>
                <Text fontSize="5xl" fontWeight="900">
                  149
                </Text>
                <Text fontSize="3xl" color="green.500">
                  /month
                </Text>
              </HStack>
            </Box>
            <VStack
              bg={useColorModeValue("green.50", "green.700")}
              py={4}
              borderBottomRadius={"xl"}
            >
              <List spacing={3} textAlign="start" px={12}>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Track up to 200 plants
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Advanced plant care reminders
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Access to premium plant care community
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Personalized plant care advice
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheckCircle} color="green.500" />
                  Early access to new features
                </ListItem>
              </List>
              <Box w="80%" pt={7}>
                <Button w="full" colorScheme="gray">
                  Start trial
                </Button>
              </Box>
            </VStack>
          </Box>
        </PriceWrapper>
        <PriceWrapper>
          <Box py={4} px={12}>
            <Text fontWeight="500" fontSize="2xl">
              Botanist
            </Text>
            <HStack justifyContent="center">
              <Text fontSize="3xl" fontWeight="600">
                $
              </Text>
              <Text fontSize="5xl" fontWeight="900">
                349
              </Text>
              <Text fontSize="3xl" color="green.500">
                /month
              </Text>
            </HStack>
          </Box>
          <VStack
            bg={useColorModeValue("green.50", "green.700")}
            py={4}
            borderBottomRadius={"xl"}
          >
            <List spacing={3} textAlign="start" px={12}>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Track unlimited plants
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Custom plant care reminders
              </ListItem>
              <ListItem>
                <ListIcon as={FaCheckCircle} color="green.500" />
                Access to exclusive plant care community
              </ListItem>
            </List>
            <Box w="80%" pt={7}>
              <Button w="full" colorScheme="gray" variant="outline">
                Start trial
              </Button>
            </Box>
          </VStack>
        </PriceWrapper>
      </Stack>
    </Box>
  );
};
export default PricingCards;
