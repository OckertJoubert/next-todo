import {
  Box,
  Center,
  Heading,
  Input,
  Text,
  VStack,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
} from "@chakra-ui/react";
import router from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "../context/AuthContext";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_LIST } from "../graphql/queries";
import TodoListItem from "./TodoListItem";
import { AddIcon } from "@chakra-ui/icons";
import { CREATE_USER_LIST_ITEM } from "../graphql/mutation";
import TodoListItems from "./TodoListItems";

const useCreateUserListItem = (refetch) => {
  const [createList] = useMutation(CREATE_USER_LIST_ITEM);

  const createUserListItem = async (name) => {
    await createList({
      variables: {
        input: {
          name,
        },
      },
    });
    refetch();
  };

  return createUserListItem;
};

const Todo = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_LIST);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newListName, setNewListName] = useState("");
  const createUserListItem = useCreateUserListItem(refetch);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    // @ts-ignore
    if (data && data?.userList && !selectedItems.id) {
      const parsedItems = JSON.parse(data.userList[0].items);
      setSelectedItems({ ...data.userList[0], items: parsedItems });
    }
    if (refetch && !loading && data) {
      const parsedItems = JSON.parse(data.userList[0].items);
      setSelectedItems({ ...data.userList[0], items: parsedItems });
    }
  }, [data, loading, refetch]);

  const { isAuthenticated, isLoading } = useAuthState();
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/sign-in");
    }
    if (isAuthenticated && !isLoading) {
    }
  }, [isAuthenticated, isLoading]);

  const handleCreateList = async () => {
    await createUserListItem(newListName).then(() => {});
    setNewListName("");
    // refetch();
    onClose();
  };

  const handleSelectItem = (item) => {
    const parsedItems = JSON.parse(item.items);

    setSelectedItems({ ...item, items: parsedItems });
  };
  // Refetch the list after a list is deleted
  const handleListDeleted = () => {
    refetch();
  };
  return (
    <>
      <Grid
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <Box
          style={{
            width: "30vw",
            borderColor: "black",
            borderRadius: "60px",
            borderStyle: "solid",
          }}
          borderWidth={1}
          border="black"
          borderRadius="md"
        >
          <VStack spacing={4} align="stretch" m={6}>
            <Center>
              <Heading>To Do</Heading>
            </Center>
            <Input placeholder="Search" />

            {data &&
              data.userList &&
              data.userList.length > 0 &&
              data.userList.map((item) => (
                <TodoListItem
                  key={item.id}
                  item={item}
                  onClick={() => handleSelectItem(item)}
                />
              ))}

            <Center>
              <Button leftIcon={<AddIcon />} width="12vw" onClick={onOpen}>
                New List
              </Button>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create New List</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Input
                      placeholder="List Name"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={handleCreateList}
                    >
                      Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Center>
          </VStack>
        </Box>
        <Box
          style={{
            width: "40vw",
            minHeight: "60vh",
          }}
          borderWidth={1}
          border="black"
          borderRadius="md"
        >
          <VStack spacing={4} align="stretch">
            {selectedItems && (
              <TodoListItems
                item={selectedItems}
                onListDeleted={handleListDeleted}
              />
            )}
          </VStack>
        </Box>
      </Grid>
    </>
  );
};

export default Todo;
