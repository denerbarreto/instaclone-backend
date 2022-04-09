import { gql } from "apollo-server";

export default gql`
  type Query {
    seeFollowing(username: String!, lastId: Int): seeFollowingOutput
  }

  type seeFollowingOutput {
    ok: Boolean!
    error: String
    following: [User]
  }
`;
