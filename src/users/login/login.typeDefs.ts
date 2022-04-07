import { gql } from "apollo-server";

export default gql`
  type Mutation {
    login(username: String, password: String!): LoginOutput!
  }

  type LoginOutput {
    ok: Boolean!
    token: String
    error: String
  }
`;
