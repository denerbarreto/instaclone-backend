import { gql } from "apollo-server";
export default gql`
  type Mutation {
    unfollowUser(username: String!): UnfollowUserOutput
  }

  type UnfollowUserOutput {
    ok: Boolean!
    error: String
  }
`;
