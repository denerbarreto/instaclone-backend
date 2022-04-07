import { gql } from "apollo-server";

export default gql`
  type Mutation {
    createAccount(
      firstName: String!
      lastName: String
      username: String!
      email: String!
      password: String!
    ): CreateAccountOutput
  }

  type CreateAccountOutput {
    ok: Boolean!
    error: String
    user: User
  }
`;
