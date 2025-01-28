import { gql } from "@apollo/client";

export const GET_USER_DETAILS = gql`
  query user {
    user {
      id
      lName
      fName
      email
      phone
      modified
      created
    }
  }
`;

export const GET_USER_LIST = gql`
  query userList {
    userList {
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
