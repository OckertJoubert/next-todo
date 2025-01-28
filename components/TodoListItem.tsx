import { Box, Flex, Text, VStack, Spacer } from "@chakra-ui/react";

type UserList = {
  created: string;
  id: string;
  items: string;
  itemsCompleted: string;
  itemsCount: string;
  modified: string;
  name: string;
  status: string;
};
const TodoListItem = ({ item, onClick }: { item: UserList; onClick: any }) => {
  return (
    <>
      <VStack
        spacing={4}
        align="stretch"
        m={6}
        onClick={onClick}
        cursor="pointer"
      >
        <Flex border={"1px solid"} borderRadius={"md"}>
          <Text p="4">{item.name}</Text>
          <Spacer />
          <Box p="4">
            {item.itemsCompleted}/{item.itemsCount}
          </Box>
        </Flex>
      </VStack>
    </>
  );
};

export default TodoListItem;
