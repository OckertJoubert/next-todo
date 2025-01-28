import { gql } from "@apollo/client";

export const CREATE_USER_LIST_ITEM = gql`
  mutation createList($input: createListInput!) {
    createList(input: $input) {
      created
      id
      items
      itemsCompleted
      itemsCount
      modified
      name
      status
    }
  }
`;

export const UPDATE_LIST_ITEMS = gql`
  mutation updateListItems($input: updateItemsInput!) {
    updateListItems(input: $input) {
      created
      id
      items
      itemsCompleted
      modified
      itemsCount
      name
      status
    }
  }
`;
