import { gql } from "apollo-server";
export default gql`
  type Query {
    seeFollowers(username: String!, page: Int!): seeFollowersOutput!
  }

  type seeFollowersOutput {
    ok: Boolean!
    error: String
    followers: [User]
    totalPages: Int
  }
`;
