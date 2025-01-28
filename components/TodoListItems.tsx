import {
  Box,
  Center,
  Flex,
  Heading,
  Text,
  VStack,
  Spacer,
  Button,
  IconButton,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from "@chakra-ui/react";
import { useMutation } from "@apollo/client";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { UPDATE_LIST_ITEMS } from "../graphql/mutation";
import { useState, useEffect } from "react";

const TodoListItems = ({ item }) => {
  const [updateListItems] = useMutation(UPDATE_LIST_ITEMS);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTaskName, setNewTaskName] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (item && item?.items && item.items.length > 0) {
      console.log("ITEMSSSS", item);
      const validItems = item.items.filter(
        (task) => task.status === "active" || task.status === "completed"
      );
      setFilteredItems(validItems);
    }
  }, [item]);

  const handleUpdateListItems = async (listId, items) => {
    console.log({
      input: {
        listId,
        items: JSON.stringify(items),
        itemsCount: items.length,
        itemsCompleted: items.filter((task) => task.status === "completed")
          .length,
      },
    });
    await updateListItems({
      variables: {
        input: {
          listId,
          items: JSON.stringify(items),
          itemsCount: items.length,
          itemsCompleted: items.filter((task) => task.status === "completed")
            .length,
        },
      },
    });
  };

  const handleCheckboxChange = (taskIndex) => {
    const updatedItems = filteredItems.map((task, index) => {
      if (index === taskIndex) {
        return {
          ...task,
          status: task.status === "active" ? "completed" : "active",
        };
      }
      return task;
    });
    setFilteredItems(updatedItems);
    handleUpdateListItems(item.id, updatedItems);
  };

  const handleAddTask = async () => {
    const updatedItems = [
      ...filteredItems,
      { name: newTaskName, status: "active" },
    ];
    onClose();
    setFilteredItems(updatedItems);
    await handleUpdateListItems(item.id, updatedItems);
    setNewTaskName("");
  };

  const handleDeleteTask = async (taskIndex) => {
    const updatedItems = filteredItems.filter(
      (_, index) => index !== taskIndex
    );
    setFilteredItems(updatedItems);
    await handleUpdateListItems(item.id, updatedItems);
  };

  return (
    <>
      <VStack spacing={4} align="stretch" m={6}>
        <Flex>
          <Center>
            <Heading>{item.name}</Heading>
          </Center>
          <Spacer />
          <Box p="4">
            <IconButton m={2} aria-label="DeleteItem" icon={<DeleteIcon />} />
            <IconButton
              m={2}
              aria-label="Search database"
              icon={<EditIcon />}
            />
            <Button leftIcon={<AddIcon />} width="12vw" onClick={onOpen}>
              New Task
            </Button>
          </Box>
        </Flex>
        {filteredItems.length > 0 &&
          filteredItems.map((task, index) => (
            <Flex
              bgColor={"black"}
              border={"1px solid"}
              borderRadius={"md"}
              key={index}
              align="center"
            >
              <Checkbox
                m="4"
                isChecked={task.status === "completed"}
                colorScheme="white"
                onChange={() => handleCheckboxChange(index)}
              />
              <Box p="4">
                <Text
                  color={"white"}
                  textDecoration={
                    task.status === "completed" ? "line-through" : "none"
                  }
                >
                  {task.name}
                </Text>
              </Box>
              <Spacer />
              <IconButton
                m={2}
                aria-label="DeleteItem"
                colorScheme={"white"}
                icon={<DeleteIcon />}
                onClick={() => handleDeleteTask(index)}
              />
            </Flex>
          ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Task Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleAddTask}
              isDisabled={!newTaskName}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TodoListItems;
