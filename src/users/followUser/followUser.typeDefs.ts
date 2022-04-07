import { gql } from "apollo-server";

export default gql`
  type Mutation {
    followUser(username: String!): FollowUserOutput
  }

  type FollowUserOutput {
    ok: Boolean!
    error: String
  }
`;
