import { gql } from "apollo-server";
export default gql`
  type Message {
    id: Int!
    payload: String!
    user: User!
    room: Room!
    read: Boolean!
    myProfile: Boolean!
    isFollowing: Boolean!
  }

  type Room {
    id: Int!
    unreadTotal: Int!
    users: [User]
    messages: [Message]
    myProfile: Boolean!
    isFollowing: Boolean!
  }
`;
